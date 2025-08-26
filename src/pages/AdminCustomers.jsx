import React, { useState, useEffect } from "react";
import { User, Vehicle, Order } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const users = await User.filter({ role: 'user' });
            const userPromises = users.map(async user => {
                const orders = await Order.filter({ customer_id: user.id });
                const vehicles = await Vehicle.filter({ user_id: user.id });
                return { ...user, orderCount: orders.length, vehicleCount: vehicles.length };
            });
            const customersWithData = await Promise.all(userPromises);
            setCustomers(customersWithData);
        } catch (error) {
            console.error("Error loading customers:", error);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="glass-effect border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">All Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-transparent">
                                    <TableHead className="text-gray-300">Name</TableHead>
                                    <TableHead className="text-gray-300">Email</TableHead>
                                    <TableHead className="text-gray-300">Joined</TableHead>
                                    <TableHead className="text-gray-300">Orders</TableHead>
                                    <TableHead className="text-gray-300">Vehicles</TableHead>
                                </TableRow>
                            </TableHeader>
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