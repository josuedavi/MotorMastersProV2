import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSocialInboxPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Social & Email Inbox</h1>
          <p className="text-gray-300">Centralize your customer communications.</p>
        </div>

        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Unified Inbox</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-400 py-16">
            <Inbox className="w-20 h-20 mx-auto text-gray-500 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">
              Social Media & Email Integration
            </h3>
            <p className="max-w-md mx-auto mb-6">
              This feature requires custom backend integration to connect with Facebook, Instagram, and email APIs. Once configured, all your messages will appear here.
            </p>
            <div className="flex justify-center items-center space-x-6">
                <Instagram className="w-8 h-8 text-pink-500" />
                <Facebook className="w-8 h-8 text-blue-500" />
                <Mail className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-gray-500 mt-8">Contact support to enable this advanced feature.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}