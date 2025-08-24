
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, File, X, Download, Loader2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument } from 'pdf-lib';

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setFiles(prev => [...prev, ...newFiles]);
      setMergedPdfUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
        setMergedPdfUrl(null);
      } else {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please drop PDF files only.',
        });
      }
      e.dataTransfer.clearData();
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        variant: 'destructive',
        title: 'Not Enough Files',
        description: 'Please select at least two PDF files to merge.',
      });
      return;
    }

    setIsMerging(true);
    setMergedPdfUrl(null);

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      toast({
        title: 'Merge Successful',
        description: 'Your PDFs have been merged. You can now download the file.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Could not merge PDFs. Please ensure all files are valid.',
      });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Merger</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Combine multiple PDF files into a single document quickly and securely. All processing is done in your browser. Follow these steps:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Upload PDFs:</strong> Click the "Upload" button or drag and drop your PDF files into the designated area.</li>
              <li><strong>Order Your Files:</strong> Once uploaded, your files will appear in a list. Drag and drop them to set the desired merge order.</li>
              <li><strong>Merge:</strong> Click the "Merge PDFs" button. The tool will combine your documents into one.</li>
              <li><strong>Download:</strong> After the merge is complete, a download button will appear. Click it to save your new, single PDF file.</li>
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
                <p className="mt-4 text-lg font-semibold">Drag & drop files here, or click to upload</p>
                <p className="text-sm text-muted-foreground">Select multiple PDF files to get started</p>
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
              <h3 className="font-semibold text-lg">Files to Merge ({files.length})</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                        key={file.name + index}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                        <div className="flex items-center gap-3">
                            <File className="h-6 w-6 text-primary" />
                            <span className="font-medium truncate max-w-xs">{file.name}</span>
                            <span className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                  ))}
                </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <Button onClick={handleMerge} disabled={files.length < 2 || isMerging} size="lg">
            {isMerging ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Merging...
              </>
            ) : "Merge PDFs"}
          </Button>

          {mergedPdfUrl && (
            <Button asChild size="lg" variant="outline">
              <a href={mergedPdfUrl} download={`merged-${Date.now()}.pdf`}>
                <Download className="mr-2 h-5 w-5" />
                Download Merged PDF
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
