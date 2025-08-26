import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Download, FileText, Trash2 } from 'lucide-react';
import { File as FileEntity, Order } from '@/api/entities';
import { UploadFile as UploadFileIntegration } from '@/api/integrations';
import { format } from 'date-fns';

export default function FileManagement({ order, files, user, onFileChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFileIntegration({ file });
      await FileEntity.create({
        order_id: order.id,
        uploaded_by_id: user.id,
        uploaded_by_role: 'customer',
        file_type: file.name.split('.').pop() || 'other',
        file_name: file.name,
        file_url: file_url,
      });
      // Notify admin
      await Order.update(order.id, { has_customer_update: true, last_customer_activity: new Date().toISOString() });
      onFileChange(); // Refresh file list
    } catch (error) {
      console.error("File upload failed", error);
    }
    setIsUploading(false);
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await FileEntity.delete(fileId);
        onFileChange();
      } catch (error) {
        console.error("Failed to delete file", error);
      }
    }
  }

  const customerFiles = files.filter(f => f.uploaded_by_role === 'customer');
  const adminFiles = files.filter(f => f.uploaded_by_role === 'admin');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">My Uploaded Files</h3>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 space-y-3">
            <ScrollArea className="h-40">
              {customerFiles.length > 0 ? customerFiles.map(file => (
                <div key={file.id} className="flex items-center p-2 bg-gray-900/50 rounded-lg mb-2">
                  <FileText className="w-5 h-5 mr-3 text-blue-400" />
                  <div className="flex-grow">
                    <p className="text-white text-sm font-medium">{file.file_name}</p>
                    <p className="text-xs text-gray-400">{format(new Date(file.created_date), 'MMM d, yyyy')}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  <Button variant="ghost" size="icon" asChild><a href={file.file_url} target="_blank" rel="noreferrer"><Download className="w-4 h-4 text-gray-300" /></a></Button>
                </div>
              )) : <p className="text-gray-400 text-sm text-center py-4">Upload your logs or ECU files here.</p>}
            </ScrollArea>
            <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <Button onClick={handleFileSelect} disabled={isUploading} className="w-full bmw-gradient">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload New File"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Tune Files from Admin</h3>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <ScrollArea className="h-40">
              {adminFiles.length > 0 ? adminFiles.map(file => (
                <div key={file.id} className="flex items-center p-2 bg-gray-900/50 rounded-lg mb-2">
                  <FileText className="w-5 h-5 mr-3 text-green-400" />
                  <div className="flex-grow">
                    <p className="text-white text-sm font-medium">{file.file_name} (v{file.version})</p>
                    <p className="text-xs text-gray-400">{format(new Date(file.created_date), 'MMM d, yyyy')}</p>
                  </div>
                  <Button variant="ghost" size="icon" asChild><a href={file.file_url} target="_blank" rel="noreferrer"><Download className="w-4 h-4 text-gray-300" /></a></Button>
                </div>
              )) : <p className="text-gray-400 text-sm text-center py-4">Your tune files will appear here.</p>}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}