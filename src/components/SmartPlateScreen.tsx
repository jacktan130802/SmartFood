import { useState, useRef, useEffect } from "react";
import { Camera, TrendingDown, Award, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner@2.0.3";

interface WasteEntry {
  id: string;
  date: string;
  mealType: string;
  wasteAmount: number;
  categories: { name: string; amount: number }[];
  image: string;
}

const mockWasteData = [
  { day: "Mon", waste: 120 },
  { day: "Tue", waste: 80 },
  { day: "Wed", waste: 150 },
  { day: "Thu", waste: 60 },
  { day: "Fri", waste: 100 },
  { day: "Sat", waste: 40 },
  { day: "Sun", waste: 90 }
];

const categoryData = [
  { name: "Vegetables", value: 35, color: "#10b981" },
  { name: "Rice/Grains", value: 25, color: "#f59e0b" },
  { name: "Meat", value: 20, color: "#ef4444" },
  { name: "Fruits", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 8, color: "#6b7280" }
];

const mockRecentEntries: WasteEntry[] = [
  {
    id: "1",
    date: "Today, 7:30 PM",
    mealType: "Dinner",
    wasteAmount: 90,
    categories: [
      { name: "Vegetables", amount: 40 },
      { name: "Rice", amount: 50 }
    ],
    image: "https://images.unsplash.com/photo-1608094406061-4e89bdcde1c3?w=200"
  },
  {
    id: "2",
    date: "Today, 1:00 PM",
    mealType: "Lunch",
    wasteAmount: 40,
    categories: [
      { name: "Vegetables", amount: 25 },
      { name: "Meat", amount: 15 }
    ],
    image: "https://images.unsplash.com/photo-1608094406061-4e89bdcde1c3?w=200"
  }
];

export function SmartPlateScreen() {
  const [entries, setEntries] = useState<WasteEntry[]>(mockRecentEntries);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanStep, setScanStep] = useState<"before" | "after" | "analyzing">("before");
  const [beforeImage, setBeforeImage] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const wasteScore = 72;
  const weeklyWaste = mockWasteData.reduce((sum, day) => sum + day.waste, 0);
  const avgDaily = Math.round(weeklyWaste / 7);
  const improvement = 15;

  // Start camera when dialog opens
  useEffect(() => {
    if (cameraOpen && scanStep !== "analyzing") {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [cameraOpen, scanStep]);

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

  const handleCameraClick = () => {
    setCameraOpen(true);
    setScanStep("before");
    setBeforeImage(false);
    setSelectedMealType("");
  };

  const handleTakePhoto = () => {
    if (scanStep === "before") {
      setBeforeImage(true);
      setTimeout(() => {
        setScanStep("after");
      }, 500);
    } else if (scanStep === "after") {
      setScanStep("analyzing");
      // Simulate AI analysis
      setTimeout(() => {
        const wasteAmount = Math.floor(Math.random() * 100) + 30;
        const newEntry: WasteEntry = {
          id: Date.now().toString(),
          date: new Date().toLocaleString(),
          mealType: selectedMealType || "Meal",
          wasteAmount: wasteAmount,
          categories: [
            { name: "Vegetables", amount: Math.floor(wasteAmount * 0.4) },
            { name: "Rice", amount: Math.floor(wasteAmount * 0.6) }
          ],
          image: "https://images.unsplash.com/photo-1608094406061-4e89bdcde1c3?w=200"
        };
        setEntries(prev => [newEntry, ...prev]);
        setCameraOpen(false);
        toast.success(`Tracked ${wasteAmount}g of food waste`);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl">SmartPlate</h1>
              <p className="text-gray-600 text-sm">Track your waste</p>
            </div>
            <Button 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={handleCameraClick}
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>

          {/* Waste Score Card */}
          <Card className="border-2 border-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">Waste Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{wasteScore}</span>
                    <span className="text-sm text-gray-600">/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 mb-2">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {improvement}% ↓
                  </Badge>
                  <p className="text-xs text-gray-600">vs last week</p>
                </div>
              </div>
              <Progress value={wasteScore} className="h-2" />
              <p className="text-xs text-gray-600 mt-2">Lower is better • Target: {'<'}50</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Weekly Waste</p>
              <p className="text-2xl font-bold">{weeklyWaste}g</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Daily Average</p>
              <p className="text-2xl font-bold">{avgDaily}g</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Trend</CardTitle>
            <CardDescription>Food waste per day (grams)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockWasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="waste" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Waste by Category</CardTitle>
            <CardDescription>This week's breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <span className="text-sm font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-3">Recent Scans</h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-orange-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{entry.mealType}</h3>
                          <p className="text-xs text-gray-600">{entry.date}</p>
                        </div>
                        <Badge variant="outline">{entry.wasteAmount}g</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entry.categories.map((cat, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cat.name} {cat.amount}g
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-10 w-10 text-yellow-600" />
              <div>
                <h3 className="font-medium">Week Warrior!</h3>
                <p className="text-sm text-gray-600">3 days with under 50g waste</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera Dialog */}
      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {scanStep === "before" && "Take Photo Before Eating"}
              {scanStep === "after" && "Take Photo After Eating"}
              {scanStep === "analyzing" && "Analyzing Waste..."}
            </DialogTitle>
            <DialogDescription>
              {scanStep === "before" && "Capture your full plate before you start eating"}
              {scanStep === "after" && "Capture your plate after finishing to measure leftovers"}
              {scanStep === "analyzing" && "AI is calculating your food waste"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {scanStep !== "analyzing" && (
              <div className="space-y-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="aspect-[4/3] bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              {scanStep === "analyzing" ? (
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 animate-pulse z-10">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Sparkles className="h-12 w-12 text-white mb-3 animate-pulse" />
                    <p className="text-white">Analyzing waste...</p>
                  </div>
                </div>
              ) : null}
              {cameraStream && scanStep !== "analyzing" ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : scanStep !== "analyzing" ? (
                <Camera className="h-16 w-16 text-gray-600" />
              ) : null}
              {beforeImage && scanStep === "before" && (
                <div className="absolute top-3 right-3 z-20">
                  <Badge className="bg-green-500">✓ Photo Taken</Badge>
                </div>
              )}
              {scanStep === "after" && (
                <div className="absolute top-3 left-3 z-20">
                  <Badge variant="secondary">Before photo saved</Badge>
                </div>
              )}
            </div>
            
            {scanStep !== "analyzing" && (
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={handleTakePhoto}
                  disabled={!selectedMealType}
                >
                  {scanStep === "before" ? "Take Before Photo" : "Take After Photo"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCameraOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}