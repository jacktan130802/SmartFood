import { useState, useRef, useEffect } from "react";
import { Camera, Search, Plus, AlertCircle, Clock, Sparkles, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";

interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate: Date;
  category: string;
  daysUntilExpiry: number;
  image: string;
}

const mockPantryItems: PantryItem[] = [
  {
    id: "1",
    name: "Cherry Tomatoes",
    quantity: "250g",
    expiryDate: new Date(2025, 10, 7),
    category: "Vegetables",
    daysUntilExpiry: 2,
    image: "https://images.unsplash.com/photo-1570543375343-63fe3d67761b?w=200"
  },
  {
    id: "2",
    name: "Spinach",
    quantity: "1 bunch",
    expiryDate: new Date(2025, 10, 6),
    category: "Vegetables",
    daysUntilExpiry: 1,
    image: "https://images.unsplash.com/photo-1634731201932-9bd92839bea2?w=200"
  },
  {
    id: "3",
    name: "Chicken Breast",
    quantity: "500g",
    expiryDate: new Date(2025, 10, 8),
    category: "Meat",
    daysUntilExpiry: 3,
    image: "https://images.unsplash.com/photo-1759493321741-883fbf9f433c?w=200"
  },
  {
    id: "4",
    name: "Milk",
    quantity: "1L",
    expiryDate: new Date(2025, 10, 10),
    category: "Dairy",
    daysUntilExpiry: 5,
    image: "https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=200"
  },
  {
    id: "5",
    name: "Greek Yogurt",
    quantity: "500g",
    expiryDate: new Date(2025, 10, 12),
    category: "Dairy",
    daysUntilExpiry: 7,
    image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=200"
  },
  {
    id: "6",
    name: "Cheddar Cheese",
    quantity: "200g",
    expiryDate: new Date(2025, 10, 15),
    category: "Dairy",
    daysUntilExpiry: 10,
    image: "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?w=200"
  }
];

export function SmartPantryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<PantryItem[]>(mockPantryItems);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Form state for manual add
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemExpiry, setNewItemExpiry] = useState("");

  // Start camera when dialog opens
  useEffect(() => {
    if (cameraOpen && !scanning) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [cameraOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Unable to access camera. Using simulation mode.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const getExpiryBadge = (days: number) => {
    if (days <= 1) {
      return <Badge variant="destructive">Expires today!</Badge>;
    } else if (days <= 3) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Expires soon</Badge>;
    } else if (days <= 7) {
      return <Badge variant="secondary">Use this week</Badge>;
    }
    return <Badge variant="outline">Fresh</Badge>;
  };

  const urgentItems = items.filter(item => item.daysUntilExpiry <= 3);
  const totalItems = items.length;

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScanCamera = () => {
    setScanning(true);
    // Simulate AI scanning
    setTimeout(() => {
      const scannedItems = [
        { name: "Carrots", quantity: "1kg", category: "Vegetables", days: 7, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200" },
        { name: "Eggs", quantity: "12 pack", category: "Dairy", days: 14, image: "https://images.unsplash.com/photo-1585355611444-06154f329e96?w=200" },
        { name: "Bread", quantity: "1 loaf", category: "Grains", days: 3, image: "https://images.unsplash.com/photo-1663904460424-91895028aa9e?w=200" }
      ];
      
      const newItems = scannedItems.map(item => ({
        id: Date.now().toString() + Math.random(),
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        daysUntilExpiry: item.days,
        expiryDate: new Date(Date.now() + item.days * 24 * 60 * 60 * 1000),
        image: item.image
      }));
      
      setItems(prev => [...newItems, ...prev]);
      setScanning(false);
      setCameraOpen(false);
      toast.success(`Added ${scannedItems.length} items to your pantry!`);
    }, 2500);
  };

  const handleAddItem = () => {
    if (!newItemName || !newItemQuantity || !newItemCategory || !newItemExpiry) {
      toast.error("Please fill in all fields");
      return;
    }

    const expiryDate = new Date(newItemExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const newItem: PantryItem = {
      id: Date.now().toString(),
      name: newItemName,
      quantity: newItemQuantity,
      category: newItemCategory,
      expiryDate: expiryDate,
      daysUntilExpiry: daysUntilExpiry,
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200"
    };

    setItems(prev => [newItem, ...prev]);
    setAddItemOpen(false);
    
    // Reset form
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemCategory("");
    setNewItemExpiry("");
    
    toast.success(`${newItemName} added to pantry!`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Smart Pantry</h1>
              <p className="text-gray-600 text-sm">{totalItems} items tracked</p>
            </div>
            <Button 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={() => setCameraOpen(true)}
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search pantry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Alert Card */}
          {urgentItems.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-3 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{urgentItems.length} items</span> need attention
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No items found</p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => setAddItemOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {getExpiryBadge(item.daysUntilExpiry)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.quantity} • {item.category}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {item.daysUntilExpiry === 0
                          ? "Expires today"
                          : item.daysUntilExpiry === 1
                          ? "Expires tomorrow"
                          : `${item.daysUntilExpiry} days left`}
                      </span>
                    </div>
                    <Progress 
                      value={Math.max(0, 100 - (item.daysUntilExpiry / 14) * 100)} 
                      className="h-1 mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4">
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setAddItemOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Camera Scan Dialog */}
      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Your Pantry</DialogTitle>
            <DialogDescription>
              Point your camera at your fridge or pantry to automatically detect items
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              {scanning ? (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse z-10">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Sparkles className="h-12 w-12 text-white mb-3 animate-pulse" />
                    <p className="text-white">AI Scanning...</p>
                  </div>
                </div>
              ) : null}
              {cameraStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="h-16 w-16 text-gray-600" />
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={handleScanCamera}
                disabled={scanning}
              >
                {scanning ? "Scanning..." : "Scan Now"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCameraOpen(false)}
                disabled={scanning}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Item Manually</DialogTitle>
            <DialogDescription>
              Enter the details of the item you want to add
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="e.g., Cherry Tomatoes"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                placeholder="e.g., 250g"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Meat">Meat</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                type="date"
                value={newItemExpiry}
                onChange={(e) => setNewItemExpiry(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleAddItem}>
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setAddItemOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}