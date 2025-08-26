import React, { useState, useEffect } from "react";
import { Order, Vehicle, User, File, ChatMessage } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Upload, MessageSquare, PlusCircle, Car } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileManagement from "../components/customer/portal/FileManagement";
import ChatInterface from "../components/customer/portal/ChatInterface";

const VisualProgressTracker = ({ status }) => {
    const steps = ["waiting_for_logs", "in_progress", "revision_needed", "completed"];
    const currentStepIndex = steps.indexOf(status);

    const stepLabels = {
        "waiting_for_logs": "Waiting for Logs",
        "in_progress": "In Progress",
        "revision_needed": "Revision Needed",
        "completed": "Completed"
    };

    return (
        <div className="w-full pt-4">
            <div className="flex justify-between items-start">
                {steps.map((step, index) => (
                    <div key={step} className="relative flex-1 text-center last:flex-none last:grow-0">
                         {index > 0 && 
                            <div className={`absolute top-1/2 left-0 w-full h-0.5 transform -translate-y-1/2 -translate-x-1/2 ${index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                         }
                        <div className={`relative z-10 mx-auto w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${index <= currentStepIndex ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-600'}`}>
                             {index < currentStepIndex && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                        <p className={`text-xs mt-2 transition-colors duration-500 ${index <= currentStepIndex ? 'text-white' : 'text-gray-400'}`}>
                            {stepLabels[step]}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function CustomerPortalPage() {
    const [user, setUser] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [orders, setOrders] = useState([]);
    const [files, setFiles] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        setLoading(true);
        try {
            const userData = await User.me();
            setUser(userData);

            const [vehiclesData, ordersData] = await Promise.all([
                Vehicle.filter({ user_id: userData.id }),
                Order.filter({ customer_id: userData.id }, "-created_date")
            ]);
            setVehicles(vehiclesData);
            setOrders(ordersData);

            if (ordersData.length > 0) {
                // If an order is already selected, re-select it to refresh data
                // Otherwise, select the first one
                const orderToSelect = selectedOrder ? ordersData.find(o => o.id === selectedOrder.id) || ordersData[0] : ordersData[0];
                handleOrderSelect(orderToSelect);
            }
        } catch (error) {
            console.error("Error loading customer data:", error);
            // navigate to login or home if not authenticated
        }
        setLoading(false);
    };

    const refreshCurrentOrderData = async () => {
        if (!selectedOrder) return;
        handleOrderSelect(selectedOrder);
    }
    
    const handleOrderSelect = async (order) => {
        setSelectedOrder(order);
        if (!order) return;
        const [filesData, messagesData] = await Promise.all([
            File.filter({ order_id: order.id }, "-created_date"),
            ChatMessage.filter({ order_id: order.id }, "created_date")
        ]);
        setFiles(filesData);
        setMessages(messagesData);
    };

    if (loading && !user) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Tunes</h1>
                    <p className="text-gray-300">Manage your vehicles, tune orders, and files.</p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <Card className="glass-effect border-gray-700">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-white flex items-center"><Car className="w-5 h-5 mr-2"/>My Vehicles</CardTitle>
                                <Button variant="ghost" size="sm"><PlusCircle className="w-4 h-4 mr-2" />Add Vehicle</Button>
                            </CardHeader>
                            <CardContent>
                                {vehicles.map(v => <div key={v.id} className="p-2 rounded bg-gray-800/50 mb-2 text-white">{v.year} {v.model}</div>)}
                            </CardContent>
                        </Card>

                        <Card className="glass-effect border-gray-700">
                             <CardHeader><CardTitle className="text-white flex items-center"><Package className="w-5 h-5 mr-2"/>My Orders</CardTitle></CardHeader>
                             <CardContent>
                                <ScrollArea className="h-96">
                                {orders.map(o => (
                                    <div 
                                        key={o.id} 
                                        className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${selectedOrder?.id === o.id ? 'bg-blue-600/20 border border-blue-500' : 'bg-gray-800/50 hover:bg-gray-800'}`}
                                        onClick={() => handleOrderSelect(o)}
                                    >
                                        <p className="font-semibold text-white">{o.package_name}</p>
                                        <p className="text-sm text-gray-400">{o.vehicle_name} - {format(new Date(o.created_date), 'MMM d, yyyy')}</p>
                                    </div>
                                ))}
                                </ScrollArea>
                             </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                    {selectedOrder ? (
                        <Card className="glass-effect border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">{selectedOrder.package_name} for {selectedOrder.vehicle_name}</CardTitle>
                                <VisualProgressTracker status={selectedOrder.status} />
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="files" className="w-full">
                                    <TabsList className="bg-gray-800 border-gray-700 w-full grid grid-cols-2">
                                        <TabsTrigger value="files" className="data-[state=active]:bg-blue-600 flex items-center gap-2"><Upload className="w-4 h-4"/>Files</TabsTrigger>
                                        <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600 flex items-center gap-2"><MessageSquare className="w-4 h-4"/>Chat</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="files" className="mt-4">
                                        <FileManagement order={selectedOrder} files={files} user={user} onFileChange={refreshCurrentOrderData} />
                                    </TabsContent>
                                    <TabsContent value="chat" className="mt-4 h-[70vh]">
                                        <ChatInterface order={selectedOrder} messages={messages} user={user} onMessageSent={refreshCurrentOrderData} />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="glass-effect border-gray-700 h-full flex items-center justify-center">
                            <div className="text-center">
                                <Package className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                                <h3 className="text-xl font-semibold text-white">Select an order to view details</h3>
                                <p className="text-gray-400 mt-2">Your active and past tunes will be listed on the left.</p>
                            </div>
                        </Card>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}