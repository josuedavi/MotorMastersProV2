import React, { useState, useEffect } from "react";
import { DollarSign, Package, Users, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Order, User } from "@/api/entities";
import { format, subDays } from "date-fns";

const StatsCard = ({ title, value, icon: Icon }) => (
  <Card className="glass-effect border-gray-700 hover-glow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-blue-400/10"><Icon className="w-6 h-6 text-blue-400" /></div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [orders, customers] = await Promise.all([Order.list(), User.list()]);
        const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
        const jobsInProgress = orders.filter(o => o.status === 'in_progress').length;
        const jobsCompleted = orders.filter(o => o.status === 'completed').length;
        
        const last7days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'MMM d')).reverse();
        const weeklyRevenue = last7days.map(day => ({
            date: day,
            revenue: orders.filter(o => format(new Date(o.created_date), 'MMM d') === day).reduce((sum, o) => sum + o.total_amount, 0)
        }));

        setStats({ totalRevenue, totalCustomers: customers.length, jobsInProgress, jobsCompleted, weeklyRevenue });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><h1 className="text-3xl font-bold text-white">Admin Dashboard</h1></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
          <StatsCard title="Total Customers" value={stats.totalCustomers} icon={Users} />
          <StatsCard title="Jobs In Progress" value={stats.jobsInProgress} icon={Activity} />
          <StatsCard title="Jobs Completed" value={stats.jobsCompleted} icon={Package} />
        </div>
        <Card className="glass-effect border-gray-700">
            <CardHeader><CardTitle className="text-white">Revenue (Last 7 Days)</CardTitle></CardHeader>
            <CardContent><div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={stats.weeklyRevenue}><CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} /><YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} /><Line type="monotone" dataKey="revenue" stroke="#0066cc" strokeWidth={3} dot={{ fill: '#0066cc' }} /></LineChart></ResponsiveContainer></div></CardContent>
        </Card>
      </div>
    </div>
  );
}