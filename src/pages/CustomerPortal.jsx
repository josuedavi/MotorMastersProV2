import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Upload, MessageSquare, Car, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order, Vehicle, File, ChatMessage, User, createPageUrl } from "@/api/entities";
import FileManagement from "../components/customer/portal/FileManagement";
import ChatInterface from "../components/customer/portal/ChatInterface";

export default function CustomerPortalPage() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [files, setFiles] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const userData = await User.me();
                setUser(userData);
                const ordersData = await Order.filter({ customer_id: userData.id }, "-created_date");
                setOrders(ordersData);
                if (ordersData.length > 0) {
                    handleOrderSelect(ordersData[0]);
                }
            } catch (error) {
                console.error("Error loading customer data:", error);
            }
            setLoading(false);
        };
        loadData();
    }, []);
    
    const handleOrderSelect = async (order) => {
        setSelectedOrder(order);
        if (!order) return;
        setLoading(true);
        try {
          const [filesData, messagesData] = await Promise.all([
            File.filter({ order_id: order.id }, "-created_date"),
            ChatMessage.filter({ order_id: order.id }, "created_date")
          ]);
          setFiles(filesData);
          setMessages(messagesData);
        } catch(e) { console.error(e) }
        setLoading(false);
    };
    
    const refreshCurrentOrderData = () => {
        if (selectedOrder) handleOrderSelect(selectedOrder);
    }

    if (loading && !selectedOrder) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">My Tunes</h1></div>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <Card className="glass-effect border-gray-700">
                             <CardHeader><CardTitle className="text-white flex items-center"><Package className="w-5 h-5 mr-2"/>My Orders</CardTitle></CardHeader>
                             <CardContent>
                                <ScrollArea className="h-96">
                                {orders.map(o => (
                                    <div key={o.id} className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${selectedOrder?.id === o.id ? 'bg-blue-600/20 border border-blue-500' : 'bg-gray-800/50 hover:bg-gray-800'}`} onClick={() => handleOrderSelect(o)}>
                                        <p className="font-semibold text-white">{o.package_name}</p>
                                        <p className="text-sm text-gray-400">{o.vehicle_name} - {format(new Date(o.created_date), 'MMM d, yyyy')}</p>
                                    </div>
                                ))}
                                </ScrollArea>
                             </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                    {loading ? <div className="h-full flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div> : selectedOrder ? (
                        <Card className="glass-effect border-gray-700">
                            <CardHeader><CardTitle className="text-white">{selectedOrder.package_name}</CardTitle></CardHeader>
                            <CardContent>
                                <Tabs defaultValue="files" className="w-full">
                                    <TabsList className="bg-gray-800 border-gray-700 w-full grid grid-cols-2">
                                        <TabsTrigger value="files" className="data-[state=active]:bg-blue-600 flex items-center gap-2"><Upload className="w-4 h-4"/>Files</TabsTrigger>
                                        <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600 flex items-center gap-2"><MessageSquare className="w-4 h-4"/>Chat</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="files" className="mt-4"><FileManagement order={selectedOrder} files={files} user={user} onFileChange={refreshCurrentOrderData} /></TabsContent>
                                    <TabsContent value="chat" className="mt-4 h-[70vh]"><ChatInterface order={selectedOrder} messages={messages} user={user} onMessageSent={refreshCurrentOrderData} /></TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="glass-effect border-gray-700 h-full flex items-center justify-center">
                            <div className="text-center">
                                <Package className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                                <h3 className="text-xl font-semibold text-white">No orders found.</h3>
                            </div>
                        </Card>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}