import React, { useState, useEffect } from "react";
import { Order, User, TunePackage } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  DollarSign, 
  Package, 
  Users, 
  Activity, 
  ListFilter,
  RefreshCw,
  BarChart,
  UserPlus
} from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <Card className="glass-effect border-gray-700 hover-glow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
        </div>
        <div className="p-3 rounded-full bg-blue-400/10">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, customersData] = await Promise.all([
        Order.list("-created_date", 200),
        User.filter({ role: 'user' })
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setLoading(false);
  };

  const calculateStats = () => {
    const totalRevenue = orders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const jobsInProgress = orders.filter(o => o.status === 'in_progress').length;
    const jobsCompleted = orders.filter(o => o.status === 'completed').length;

    const firstTimeCustomers = new Set(customers.map(c => c.email));
    const repeatCustomerCount = orders.length - new Set(orders.map(o => o.customer_id)).size;

    return {
      totalRevenue,
      totalCustomers: customers.length,
      jobsInProgress,
      jobsCompleted,
      repeatCustomerCount
    };
  };

  const generateChartData = () => {
    const weeklyData = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: format(date, "MMM d"),
        revenue: 0,
      };
    }).reverse();

    orders.forEach(order => {
      if (order.payment_status === 'paid') {
        const orderDateStr = format(new Date(order.created_date), "MMM d");
        const day = weeklyData.find(d => d.date === orderDateStr);
        if (day) {
          day.revenue += order.total_amount;
        }
      }
    });
    return weeklyData;
  };

  const stats = calculateStats();
  const chartData = generateChartData();

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Overview of your tuning business.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <StatsCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="All-time revenue" />
          <StatsCard title="Total Customers" value={stats.totalCustomers} icon={Users} trend="Unique customer accounts" />
          <StatsCard title="Jobs In Progress" value={stats.jobsInProgress} icon={Activity} trend="Active tuning jobs" />
          <StatsCard title="Jobs Completed" value={stats.jobsCompleted} icon={Package} trend="All-time completed" />
          <StatsCard title="Repeat Customers" value={stats.repeatCustomerCount} icon={UserPlus} trend="Customers with multiple tunes" />
        </div>
        
        <Card className="glass-effect border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Revenue (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                            <Line type="monotone" dataKey="revenue" stroke="#0066cc" strokeWidth={3} dot={{ fill: '#0066cc' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}