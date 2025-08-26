import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { User, Order, Vehicle, Loader2 } from "@/api/entities";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [users, orders, vehicles] = await Promise.all([User.list(), Order.list(), Vehicle.list()]);
                const customerData = users.filter(u => u.role === 'user').map(u => ({
                    ...u,
                    orderCount: orders.filter(o => o.customer_id === u.id).length,
                    vehicleCount: vehicles.filter(v => v.user_id === u.id).length
                }));
                setCustomers(customerData);
            } catch (error) { console.error("Error loading customers:", error); }
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="glass-effect border-gray-700">
                    <CardHeader><CardTitle className="text-white">All Customers</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow className="border-gray-700 hover:bg-transparent"><TableHead className="text-gray-300">Name</TableHead><TableHead className="text-gray-300">Email</TableHead><TableHead className="text-gray-300">Joined</TableHead><TableHead className="text-gray-300">Orders</TableHead><TableHead className="text-gray-300">Vehicles</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {customers.map(customer => (
                                    <TableRow key={customer.id} className="border-gray-700 hover:bg-gray-800/50">
                                        <TableCell className="font-medium text-white">{customer.full_name}</TableCell>
                                        <TableCell className="text-gray-300">{customer.email}</TableCell>
                                        <TableCell className="text-gray-400">{format(new Date(customer.created_date), "MMM d, yyyy")}</TableCell>
                                        <TableCell className="text-white">{customer.orderCount}</TableCell>
                                        <TableCell className="text-white">{customer.vehicleCount}</TableCell>
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