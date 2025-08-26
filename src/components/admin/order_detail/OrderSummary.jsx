import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Car, Package } from 'lucide-react';
import { format } from 'date-fns';

export default function OrderSummary({ order }) {
  if (!order) return null;

  return (
    <Card className="glass-effect border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-3 text-blue-400" />
          <span className="text-gray-300">Customer:</span>
          <span className="ml-auto font-medium text-white">{order.customer_name}</span>
        </div>
        <div className="flex items-center">
          <Car className="w-4 h-4 mr-3 text-blue-400" />
          <span className="text-gray-300">Vehicle:</span>
          <span className="ml-auto font-medium text-white">{order.vehicle_name}</span>
        </div>
        <div className="flex items-center">
          <Package className="w-4 h-4 mr-3 text-blue-400" />
          <span className="text-gray-300">Package:</span>
          <span className="ml-auto font-medium text-white">{order.package_name}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-300">Order Date:</span>
          <span className="ml-auto font-medium text-white">{format(new Date(order.created_date), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-300">Total Amount:</span>
          <span className="ml-auto font-medium text-green-400">${order.total_amount.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}