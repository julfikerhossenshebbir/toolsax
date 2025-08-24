'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, File, Download, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument } from 'pdf-lib';

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [splitPdfUrls, setSplitPdfUrls] = useState<string[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
          toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a PDF file.' });
          return;
      }
      setFile(selectedFile);
      setSplitPdfUrls([]);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
       if (selectedFile.type !== 'application/pdf') {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please drop a PDF file only.' });
        return;
      }
      setFile(selectedFile);
      setSplitPdfUrls([]);
      e.dataTransfer.clearData();
    }
  };

  const resetState = () => {
    setFile(null);
    setSplitPdfUrls([]);
  };

  const handleSplit = async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'No File Selected', description: 'Please upload a PDF file first.' });
      return;
    }

    setIsSplitting(true);
    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pageCount = pdfDoc.getPageCount();
      const urls = [];

      for (let i = 0; i < pageCount; i++) {
        const newDoc = await PDFDocument.create();
        const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
        newDoc.addPage(copiedPage);
        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        urls.push(URL.createObjectURL(blob));
      }
      setSplitPdfUrls(urls);
      toast({ title: 'Split Successful', description: `PDF was split into ${pageCount} pages.` });

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'An Error Occurred', description: 'Could not split the PDF. Please ensure it is a valid file.' });
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Splitter</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Split a single PDF into multiple, one-page PDF files. All processing is done securely in your browser.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Upload a PDF:</strong> Click the upload area or drag and drop your PDF file.</li>
              <li><strong>Split the PDF:</strong> Click the "Split PDF" button to start the process.</li>
              <li><strong>Download Pages:</strong> Once complete, a download button will appear for each individual page.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
            <div
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">Drag & drop a PDF here, or click to upload</p>
                <input type="file" id="file-upload" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                        <File className="h-6 w-6 text-primary" />
                        <span className="font-medium truncate max-w-xs">{file.name}</span>
                        <span className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={resetState}>
                        <RefreshCw className="h-5 w-5" />
                    </Button>
                </div>
                <div className="text-center">
                    <Button onClick={handleSplit} disabled={isSplitting} size="lg">
                        {isSplitting ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Splitting...</>
                        ) : 'Split PDF'}
                    </Button>
                </div>
            </div>
        )}

        {splitPdfUrls.length > 0 && (
          <div className="space-y-4">
              <h3 className="font-semibold text-lg">Split Pages ({splitPdfUrls.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {splitPdfUrls.map((url, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 p-2 border rounded-lg">
                          <File className="h-12 w-12 text-muted-foreground" />
                          <p className="font-medium">Page {index + 1}</p>
                          <Button asChild variant="secondary" size="sm" className="w-full">
                              <a href={url} download={`${file?.name.replace('.pdf', '')}-page-${index + 1}.pdf`}>
                                <Download className="mr-2 h-4 w-4" /> Download
                              </a>
                          </Button>
                      </div>
                  ))}
              </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
