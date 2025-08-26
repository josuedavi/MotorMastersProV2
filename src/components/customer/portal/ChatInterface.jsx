import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { ChatMessage, Order } from '@/api/entities';
import { format } from 'date-fns';

export default function ChatInterface({ order, messages, user, onMessageSent }) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      await ChatMessage.create({ order_id: order.id, sender_id: user.id, sender_role: 'customer', sender_name: user.full_name, message: newMessage });
      await Order.update(order.id, { has_customer_update: true, last_customer_activity: new Date().toISOString() });
      setNewMessage('');
      onMessageSent();
    } catch (error) { console.error("Failed to send message", error); }
    setIsSending(false);
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender_role === 'customer' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p className="font-bold text-sm">{msg.sender_name}</p><p className="text-sm">{msg.message}</p><p className="text-xs opacity-70 text-right mt-1">{format(new Date(msg.created_date), 'p')}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 flex gap-2">
        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." className="bg-gray-800 border-gray-600 text-white" disabled={isSending}/>
        <Button onClick={handleSendMessage} disabled={isSending}><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}