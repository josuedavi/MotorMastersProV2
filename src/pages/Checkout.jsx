
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TunePackage, Order, User, Vehicle } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Car, CreditCard, Shield, Clock, Headphones, FileText } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    vehicle_info: {
      make: "",
      model: "",
      year: "",
      transmission: "",
      vin: ""
    },
    fuel_type: "",
    addon_services: []
  });

  const addonServices = [
    { id: "priority", name: "Priority Support", price: 99, description: "24/7 priority support and faster processing" },
    { id: "datalog", name: "Datalog Review", price: 149, description: "Professional analysis of your vehicle's performance data" },
    { id: "remote", name: "Remote Assistance", price: 199, description: "Live remote tuning session and real-time adjustments" },
    { id: "warranty", name: "Extended Warranty", price: 299, description: "6-month extended warranty on tune files and support" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        customer_name: userData.full_name || "",
        customer_email: userData.email || "",
        customer_phone: userData.phone || ""
      }));

      const urlParams = new URLSearchParams(window.location.search);
      const packageId = urlParams.get('package');
      
      if (packageId) {
        const packages = await TunePackage.list();
        const pkg = packages.find(p => p.id === packageId);
        if (pkg) {
          setSelectedPackage(pkg);
          setFormData(prev => ({
            ...prev,
            fuel_type: pkg.fuel_requirement
          }));
        }
      }
    } catch (error) {
      navigate(createPageUrl("Home"));
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddonToggle = (addonId) => {
    setFormData(prev => ({
      ...prev,
      addon_services: prev.addon_services.includes(addonId)
        ? prev.addon_services.filter(id => id !== addonId)
        : [...prev.addon_services, addonId]
    }));
  };

  const calculateTotal = () => {
    let total = selectedPackage?.price || 0;
    formData.addon_services.forEach(addonId => {
      const addon = addonServices.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // First, create or find the vehicle
      let vehicle;
      // Note: Assuming `Vehicle` entity can be filtered by `make`, `model`, `year`
      // The outline only specifies `year` and `model` for filtering and creating.
      // If `make` is also needed for uniqueness, it should be added here.
      const existingVehicles = await Vehicle.filter({
        user_id: user.id,
        year: parseInt(formData.vehicle_info.year),
        model: formData.vehicle_info.model
      });

      if (existingVehicles.length > 0) {
        vehicle = existingVehicles[0];
      } else {
        vehicle = await Vehicle.create({
          user_id: user.id,
          make: formData.vehicle_info.make, // Added 'make' based on good practice, though not explicitly in outline's create args
          year: parseInt(formData.vehicle_info.year),
          model: formData.vehicle_info.model,
          vin: formData.vehicle_info.vin || "",
          modifications: "" // Assuming this field exists and can be empty
        });
      }

      // Create the order with proper IDs
      const orderData = {
        customer_id: user.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        vehicle_id: vehicle.id,
        vehicle_name: `${formData.vehicle_info.year} ${formData.vehicle_info.make} ${formData.vehicle_info.model}`,
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        total_amount: calculateTotal(),
        status: "waiting_for_logs", // Changed from "pending_payment"
        payment_status: "paid" // Changed from "pending", implying payment is handled externally before this point
      };

      await Order.create(orderData);
      
      // Update user info (only phone, vehicle_info is now separate)
      await User.updateMyUserData({
        phone: formData.customer_phone
      });

      navigate(createPageUrl("CustomerPortal"));
    } catch (error) {
      console.error("Error creating order:", error);
      // Optionally show an error message to the user
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Package Not Found</h1>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Home"))}
            className="text-gray-300 hover:text-white mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Car className="w-5 h-5 mr-2 text-blue-400" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Make</Label>
                      <Input
                        value={formData.vehicle_info.make}
                        onChange={(e) => handleInputChange('vehicle_info.make', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="BMW"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Model</Label>
                      <Input
                        value={formData.vehicle_info.model}
                        onChange={(e) => handleInputChange('vehicle_info.model', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="M240i"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Year</Label>
                      <Input
                        type="number"
                        value={formData.vehicle_info.year}
                        onChange={(e) => handleInputChange('vehicle_info.year', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="2022"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Transmission</Label>
                      <Select 
                        value={formData.vehicle_info.transmission} 
                        onValueChange={(value) => handleInputChange('vehicle_info.transmission', value)}
                        required
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="Automatic" className="text-white">Automatic</SelectItem>
                          <SelectItem value="Manual" className="text-white">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300">VIN (Optional)</Label>
                      <Input
                        value={formData.vehicle_info.vin}
                        onChange={(e) => handleInputChange('vehicle_info.vin', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter VIN for precise tuning"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-400" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Full Name</Label>
                      <Input
                        value={formData.customer_name}
                        onChange={(e) => handleInputChange('customer_name', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Phone Number</Label>
                      <Input
                        value={formData.customer_phone}
                        onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300">Email</Label>
                      <Input
                        value={formData.customer_email}
                        onChange={(e) => handleInputChange('customer_email', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                        type="email"
                        required
                        disabled // Email is pre-filled from user data and should not be changed here
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Shield className="w-5 h-5 mr-2 text-blue-400" />
                    Fuel Type Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.fuel_type} onValueChange={(value) => handleInputChange('fuel_type', value)} required>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="91 Octane" className="text-white">91 Octane (Premium)</SelectItem>
                      <SelectItem value="93 Octane" className="text-white">93 Octane (Premium+)</SelectItem>
                      <SelectItem value="E85" className="text-white">E85 Ethanol</SelectItem>
                      <SelectItem value="Race Fuel" className="text-white">Race Fuel</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Headphones className="w-5 h-5 mr-2 text-blue-400" />
                    Add-On Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addonServices.map((addon) => (
                    <div key={addon.id} className="flex items-start space-x-3 p-4 bg-gray-800/50 rounded-lg">
                      <Checkbox
                        id={addon.id}
                        checked={formData.addon_services.includes(addon.id)}
                        onCheckedChange={() => handleAddonToggle(addon.id)}
                        className="border-gray-600 data-[state=checked]:bg-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={addon.id} className="font-medium text-white cursor-pointer">
                            {addon.name}
                          </Label>
                          <span className="text-blue-400 font-semibold">+${addon.price}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{addon.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="glass-effect border-gray-700 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">{selectedPackage.name}</div>
                        <div className="text-sm text-gray-400">{selectedPackage.stage}</div>
                      </div>
                      <div className="text-white">${selectedPackage.price.toLocaleString()}</div>
                    </div>

                    {formData.addon_services.map(addonId => {
                      const addon = addonServices.find(a => a.id === addonId);
                      return (
                        <div key={addonId} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">{addon.name}</span>
                          <span className="text-gray-300">+${addon.price}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-blue-400">${calculateTotal().toLocaleString()}</span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {selectedPackage.delivery_time} delivery
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      30-day money-back guarantee
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Lifetime tune updates included
                    </div>
                  </div>

                  <Button
                    type="submit" // Changed to type="submit" for form
                    disabled={processing}
                    className="w-full bmw-gradient hover:opacity-90 transition-opacity py-3"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Complete Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
