import React, { useState, useEffect } from 'react';
import { Order, File, ChatMessage, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import OrderSummary from '../components/admin/order_detail/OrderSummary';
import StatusManager from '../components/admin/order_detail/StatusManager';
import FileInfo from '../components/admin/order_detail/FileInfo';
import ChatBox from '../components/admin/order_detail/ChatBox';

export default function AdminOrderDetailPage() {
  const [order, setOrder] = useState(null);
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) setOrderId(id); else navigate(createPageUrl('AdminOrders'));
  }, [navigate]);

  useEffect(() => {
    if (orderId) loadData();
  }, [orderId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allOrders = await Order.list();
      const currentOrder = allOrders.find(o => o.id === orderId);
      if (!currentOrder) { setLoading(false); return; }

      const [filesData, messagesData, userData] = await Promise.all([
        File.filter({ order_id: orderId }, "-created_date"),
        ChatMessage.filter({ order_id: orderId }, "created_date"),
        User.me()
      ]);
      setOrder(currentOrder);
      setFiles(filesData);
      setMessages(messagesData);
      setUser(userData);
      
      if (currentOrder.has_customer_update) {
        await Order.update(currentOrder.id, { has_customer_update: false });
      }
    } catch (error) { console.error("Failed to load order details:", error); }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>;
  if (!order) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white"><h1>Order not found.</h1></div>;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate(createPageUrl('AdminOrders'))} className="text-gray-300 hover:text-white mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Back to All Jobs</Button>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6"><OrderSummary order={order} /><StatusManager order={order} onUpdate={setOrder} /></div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700"><TabsTrigger value="chat">Chat</TabsTrigger><TabsTrigger value="files">Files</TabsTrigger></TabsList>
              <TabsContent value="chat" className="mt-4"><ChatBox order={order} messages={messages} onMessageSent={loadData} user={user} /></TabsContent>
              <TabsContent value="files" className="mt-4"><FileInfo order={order} files={files} onFileChange={loadData} user={user} /></TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}