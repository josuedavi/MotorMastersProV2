import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Order } from '@/api/entities';

export default function StatusManager({ order, onUpdate }) {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = ["waiting_for_logs", "in_progress", "revision_needed", "completed", "archived"];
  const statusColors = {
    waiting_for_logs: "bg-orange-600",
    in_progress: "bg-blue-600",
    revision_needed: "bg-yellow-600",
    completed: "bg-green-600",
    archived: "bg-gray-600",
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await Order.update(order.id, { status: currentStatus });
      onUpdate({ ...order, status: currentStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
    setIsUpdating(false);
  };

  return (
    <Card className="glass-effect border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Job Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={currentStatus} onValueChange={setCurrentStatus}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {statuses.map(s => (
              <SelectItem key={s} value={s} className="text-white capitalize">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${statusColors[s]}`}></span>
                  {s.replace(/_/g, " ")}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleUpdateStatus} disabled={isUpdating || currentStatus === order.status} className="w-full bmw-gradient">
          {isUpdating ? "Updating..." : "Update Status"}
        </Button>
      </CardContent>
    </Card>
  );
}