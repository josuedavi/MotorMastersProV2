import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Download, FileText } from 'lucide-react';
import { File as FileEntity } from '@/api/entities';
import { UploadFile as UploadFileIntegration } from '@/api/integrations';
import { format } from 'date-fns';

export default function FileInfo({ order, files, onFileChange, user }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFileIntegration({ file });
      await FileEntity.create({ order_id: order.id, uploaded_by_id: user.id, uploaded_by_role: 'admin', file_type: file.name.split('.').pop() || 'other', file_name: file.name, file_url: file_url });
      onFileChange();
    } catch (error) { console.error("File upload failed", error); }
    setIsUploading(false);
  };

  const customerFiles = files.filter(f => f.uploaded_by_role === 'customer');
  const adminFiles = files.filter(f => f.uploaded_by_role === 'admin');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Tune Files (Admin)</h3>
        <div className="bg-gray-800/50 border-gray-700 p-4 rounded-lg">
          <ScrollArea className="h-48 pr-3">{adminFiles.map(file => (<div key={file.id} className="flex items-center p-2 bg-gray-900/50 rounded-lg"><FileText className="w-5 h-5 mr-3 text-blue-400" /><div className="flex-grow"><p className="text-white">{file.file_name}</p></div><Button variant="ghost" size="icon" asChild><a href={file.file_url} target="_blank" rel="noreferrer"><Download className="w-4 h-4" /></a></Button></div>))}</ScrollArea>
          <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full mt-3"><Upload className="w-4 h-4 mr-2" />{isUploading ? "Uploading..." : "Upload Tune File"}</Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Customer Logs & Files</h3>
        <div className="bg-gray-800/50 border-gray-700 p-4 rounded-lg">
          <ScrollArea className="h-48 pr-3">{customerFiles.map(file => (<div key={file.id} className="flex items-center p-2 bg-gray-900/50 rounded-lg"><FileText className="w-5 h-5 mr-3 text-green-400" /><div className="flex-grow"><p className="text-white">{file.file_name}</p></div><Button variant="ghost" size="icon" asChild><a href={file.file_url} target="_blank" rel="noreferrer"><Download className="w-4 h-4" /></a></Button></div>))}</ScrollArea>
        </div>
      </div>
    </div>
  );
}