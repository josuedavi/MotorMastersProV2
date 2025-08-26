import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip } from 'lucide-react';
import { ChatMessage } from '@/api/entities';
import { UploadFile as UploadFileIntegration } from '@/api/integrations';
import { format } from 'date-fns';

export default function ChatBox({ order, messages, onMessageSent, user }) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom on new message
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await ChatMessage.create({
        order_id: order.id,
        sender_id: user.id,
        sender_role: 'admin',
        sender_name: user.full_name,
        message: newMessage,
      });
      setNewMessage('');
      onMessageSent();
    } catch (error) {
      console.error("Failed to send message", error);
    }
    setIsSending(false);
  };
  
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSending(true);
    try {
      const { file_url } = await UploadFileIntegration({ file });
      await ChatMessage.create({
        order_id: order.id,
        sender_id: user.id,
        sender_role: 'admin',
        sender_name: user.full_name,
        message: `Attached file: ${file.name}`,
        attachments: [{ file_name: file.name, file_url: file_url }]
      });
      onMessageSent();
    } catch (error) {
      console.error("File upload failed", error);
    }
    setIsSending(false);
  };

  return (
    <Card className="glass-effect border-gray-700 h-[70vh] flex flex-col">
      <CardContent className="p-4 flex-grow flex flex-col">
        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender_role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                  <p className="font-bold text-sm">{msg.sender_name}</p>
                  <p className="text-sm">{msg.message}</p>
                  {msg.attachments?.map(att => (
                    <a href={att.file_url} key={att.file_url} target="_blank" className="text-xs underline flex items-center mt-1">
                        <Paperclip className="w-3 h-3 mr-1" /> {att.file_name}
                    </a>
                  ))}
                  <p className="text-xs opacity-70 text-right mt-1">{format(new Date(msg.created_date), 'p')}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 flex gap-2">
          <Input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isSending}
          />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isSending}>
              <Paperclip className="w-5 h-5 text-gray-400" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="bg-gray-800 border-gray-600 text-white"
            disabled={isSending}
          />
          <Button onClick={handleSendMessage} disabled={isSending}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}