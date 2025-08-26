import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Instagram, Facebook, Mail } from "lucide-react";

export default function AdminSocialInboxPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">Social & Email Inbox</h1></div>
        <Card className="glass-effect border-gray-700">
          <CardHeader><CardTitle className="text-white">Unified Inbox</CardTitle></CardHeader>
          <CardContent className="text-center text-gray-400 py-16">
            <Inbox className="w-20 h-20 mx-auto text-gray-500 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">Coming Soon</h3>
            <p className="max-w-md mx-auto mb-6">Integrate social media and email accounts to manage all communications from one place.</p>
            <div className="flex justify-center items-center space-x-6"><Instagram className="w-8 h-8 text-pink-500" /><Facebook className="w-8 h-8 text-blue-500" /><Mail className="w-8 h-8 text-red-500" /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}