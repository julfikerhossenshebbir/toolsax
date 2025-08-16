'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '../ui/button';

const CONVERSION_CATEGORIES = {
  length: {
    name: 'Length',
    units: {
      meters: 'Meters',
      kilometers: 'Kilometers',
      centimeters: 'Centimeters',
      millimeters: 'Millimeters',
      miles: 'Miles',
      yards: 'Yards',
      feet: 'Feet',
      inches: 'Inches',
    },
    // Base unit: meters
    factors: {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.34,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254,
    },
  },
  weight: {
    name: 'Weight',
    units: {
      kilograms: 'Kilograms',
      grams: 'Grams',
      milligrams: 'Milligrams',
      pounds: 'Pounds',
      ounces: 'Ounces',
    },
    // Base unit: kilograms
    factors: {
      kilograms: 1,
      grams: 0.001,
      milligrams: 0.000001,
      pounds: 0.453592,
      ounces: 0.0283495,
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      celsius: 'Celsius',
      fahrenheit: 'Fahrenheit',
      kelvin: 'Kelvin',
    },
  },
};

type Category = keyof typeof CONVERSION_CATEGORIES;

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [inputValue, setInputValue] = useState('1');
  
  const [fromUnit, setFromUnit] = useState<string>('meters');
  const [toUnit, setToUnit] = useState<string>('feet');

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    const units = Object.keys(CONVERSION_CATEGORIES[newCategory].units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setInputValue('1');
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  const outputValue = useMemo(() => {
    const inputNum = parseFloat(inputValue);
    if (isNaN(inputNum)) return '';

    const categoryData = CONVERSION_CATEGORIES[category];

    if (category === 'temperature') {
      if (fromUnit === toUnit) return inputNum;
      
      let celsius;
      // Convert input to Celsius
      if (fromUnit === 'fahrenheit') {
        celsius = (inputNum - 32) * 5/9;
      } else if (fromUnit === 'kelvin') {
        celsius = inputNum - 273.15;
      } else {
        celsius = inputNum;
      }

      // Convert from Celsius to output
      if (toUnit === 'fahrenheit') {
        return (celsius * 9/5) + 32;
      } else if (toUnit === 'kelvin') {
        return celsius + 273.15;
      }
      return celsius;

    } else {
      const fromFactor = categoryData.factors[fromUnit as keyof typeof categoryData.factors];
      const toFactor = categoryData.factors[toUnit as keyof typeof categoryData.factors];
      const baseValue = inputNum * fromFactor;
      const result = baseValue / toFactor;
      
      // Return with reasonable precision
      return Number(result.toFixed(6));
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const currentCategoryData = CONVERSION_CATEGORIES[category];
  const unitOptions = Object.entries(currentCategoryData.units).map(([key, name]) => (
    <SelectItem key={key} value={key}>{name}</SelectItem>
  ));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Easily convert between different units for length, weight, and temperature. Follow these steps:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Select a Category:</strong> Choose the type of measurement you want to convert (e.g., Length, Weight, Temperature).</li>
              <li><strong>Enter a Value:</strong> Type the number you want to convert in the "From" field.</li>
              <li><strong>Choose Units:</strong> Use the dropdown menus to select the "From" and "To" units.</li>
              <li><strong>View the Result:</strong> The converted value will instantly appear in the "To" field.</li>
              <li><strong>Swap Units:</strong> Click the swap button between the two fields to quickly reverse the conversion.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Conversion Type</Label>
          <Select value={category} onValueChange={(val) => handleCategoryChange(val as Category)}>
            <SelectTrigger id="category" className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CONVERSION_CATEGORIES).map(([key, { name }]) => (
                <SelectItem key={key} value={key}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full space-y-2">
            <Label htmlFor="from-value">From</Label>
            <div className="flex gap-2">
              <Input
                id="from-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="min-w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{unitOptions}</SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-8">
            <Button variant="ghost" size="icon" onClick={handleSwap}>
              <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="to-value">To</Label>
            <div className="flex gap-2">
                <Input
                    id="to-value"
                    type="text"
                    value={outputValue}
                    readOnly
                    className="bg-muted font-semibold"
                />
                <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="min-w-[140px]">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>{unitOptions}</SelectContent>
                </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
