
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, File, X, Download, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import NextImage from 'next/image';

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      setFiles(prev => [...prev, ...newFiles]);
      setConvertedPdfUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
        setConvertedPdfUrl(null);
      } else {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please drop image files only.',
        });
      }
      e.dataTransfer.clearData();
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setConvertedPdfUrl(null);
  };

  const handleConvert = async () => {
    if (files.length < 1) {
      toast({
        variant: 'destructive',
        title: 'No Files Selected',
        description: 'Please select at least one image to convert.',
      });
      return;
    }

    setIsConverting(true);
    setConvertedPdfUrl(null);

    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const image = await pdfDoc.embedJpg(arrayBuffer);
        
        const page = pdfDoc.addPage();
        const { width, height } = image.scale(1);
        
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        const scale = Math.min(pageWidth / width, pageHeight / height);
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setConvertedPdfUrl(url);
      toast({
        title: 'Conversion Successful',
        description: 'Your images have been converted to a PDF.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Could not convert images. Please ensure all files are valid image formats (e.g., JPG, PNG).',
      });
    } finally {
      setIsConverting(false);
    }
  };
  
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFiles(items);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Image to PDF Converter</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Combine multiple images into a single PDF file quickly and securely. All processing is done in your browser. Follow these steps:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Upload Images:</strong> Click the "Upload" button or drag and drop your image files (JPG, PNG, etc.) into the area.</li>
              <li><strong>Order Your Files:</strong> Once uploaded, drag and drop the images to set the desired order for the PDF pages.</li>
              <li><strong>Convert:</strong> Click the "Convert to PDF" button.</li>
              <li><strong>Download:</strong> After conversion, a download button will appear. Click it to save your new PDF file.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <div
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">Drag & drop images here, or click to upload</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG, and other image formats</p>
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
              <h3 className="font-semibold text-lg">Files to Convert ({files.length})</h3>
               <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="image-files">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {files.map((file, index) => (
                        <Draggable key={file.name + index} draggableId={file.name + index} index={index}>
                           {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-shadow ${snapshot.isDragging ? 'shadow-lg bg-accent' : 'bg-card'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    <NextImage src={URL.createObjectURL(file)} alt={file.name} width={40} height={40} className="rounded-md object-cover h-10 w-10" />
                                    <span className="font-medium truncate max-w-xs">{file.name}</span>
                                    <span className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                           )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <Button onClick={handleConvert} disabled={files.length < 1 || isConverting} size="lg">
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Converting...
              </>
            ) : "Convert to PDF"}
          </Button>

          {convertedPdfUrl && (
            <Button asChild size="lg" variant="outline">
              <a href={convertedPdfUrl} download={`converted-${Date.now()}.pdf`}>
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
