import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Bell, ListFilter, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order, createPageUrl } from "@/api/entities";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();

    const statuses = ["all", "waiting_for_logs", "in_progress", "revision_needed", "completed", "archived"];
    const statusColors = { waiting_for_logs: "bg-orange-600", in_progress: "bg-blue-600", revision_needed: "bg-yellow-600", completed: "bg-green-600", archived: "bg-gray-600" };

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                const ordersData = await Order.list("-created_date");
                setOrders(ordersData);
            } catch (error) { console.error("Error loading orders:", error); }
            setLoading(false);
        };
        loadOrders();
    }, []);

    useEffect(() => {
        if (statusFilter === 'all') setFilteredOrders(orders);
        else setFilteredOrders(orders.filter(o => o.status === statusFilter));
    }, [statusFilter, orders]);

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="glass-effect border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">All Jobs / Orders</CardTitle>
                        <div className="flex items-center space-x-2">
                            <ListFilter className="w-5 h-5 text-gray-400" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">{statuses.map(s => (<SelectItem key={s} value={s} className="text-white capitalize">{s.replace(/_/g, " ")}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow className="border-gray-700 hover:bg-transparent"><TableHead className="text-gray-300">Order ID</TableHead><TableHead className="text-gray-300">Customer</TableHead><TableHead className="text-gray-300">Vehicle</TableHead><TableHead className="text-gray-300">Status</TableHead><TableHead className="text-gray-300">Date</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filteredOrders.map(order => (
                                    <TableRow key={order.id} className="border-gray-700 hover:bg-gray-800/50 cursor-pointer" onClick={() => navigate(createPageUrl(`AdminOrderDetail?id=${order.id}`))}>
                                        <TableCell className="font-medium text-white"><div className="flex items-center space-x-2"><span>#{order.id.slice(-6)}</span>{order.has_customer_update && <Bell className="w-4 h-4 text-orange-400 animate-pulse" />}</div></TableCell>
                                        <TableCell className="text-white">{order.customer_name}</TableCell>
                                        <TableCell className="text-gray-300">{order.vehicle_name}</TableCell>
                                        <TableCell><Badge className={`${statusColors[order.status]} text-white text-xs`}>{order.status.replace(/_/g, ' ')}</Badge></TableCell>
                                        <TableCell className="text-gray-400">{format(new Date(order.created_date), "MMM d, yyyy")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}