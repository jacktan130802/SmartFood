import { useState } from "react";
import { Heart, MapPin, Package, Clock, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner@2.0.3";

interface DonationItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  expiryDays: number;
}

interface Recipient {
  id: string;
  name: string;
  type: "Community Centre" | "Hawker Centre" | "Food Bank";
  distance: number;
  acceptedIngredients: string[];
  openHours: string;
  address: string;
  image: string;
}

const mockDonationItems: DonationItem[] = [
  { id: "1", name: "Cherry Tomatoes", quantity: "250g", category: "Vegetables", expiryDays: 2 },
  { id: "2", name: "Spinach", quantity: "1 bunch", category: "Vegetables", expiryDays: 1 }
];

const mockRecipients: Recipient[] = [
  {
    id: "1",
    name: "Tampines Community Centre",
    type: "Community Centre",
    distance: 0.8,
    acceptedIngredients: ["Fresh Vegetables", "Fruits", "Rice", "Canned Goods", "Pasta", "Cooking Oil"],
    openHours: "Mon-Sun: 8am - 10pm",
    address: "1 Tampines Street 11, Singapore 529587",
    image: "https://images.unsplash.com/photo-1761959150488-863999e308f9?w=400"
  },
  {
    id: "2",
    name: "Maxwell Food Centre",
    type: "Hawker Centre",
    distance: 1.2,
    acceptedIngredients: ["Fresh Vegetables", "Eggs", "Chicken", "Pork", "Seafood", "Noodles"],
    openHours: "Daily: 6am - 11pm",
    address: "1 Kadayanallur Street, Singapore 069184",
    image: "https://images.unsplash.com/photo-1750595372704-0894cc2a798c?w=400"
  },
  {
    id: "3",
    name: "Central Food Bank",
    type: "Food Bank",
    distance: 1.5,
    acceptedIngredients: ["Fresh Vegetables", "Fruits", "Dairy Products", "Meat", "Canned Goods", "Rice", "Bread"],
    openHours: "Mon-Fri: 9am - 6pm",
    address: "120 Prinsep Street, Singapore 188655",
    image: "https://images.unsplash.com/photo-1615897570582-285ffe259530?w=400"
  },
  {
    id: "4",
    name: "Bedok Community Centre",
    type: "Community Centre",
    distance: 2.1,
    acceptedIngredients: ["Fresh Vegetables", "Fruits", "Rice", "Cooking Oil", "Dried Goods"],
    openHours: "Mon-Sun: 7am - 11pm",
    address: "850 New Upper Changi Road, Singapore 467355",
    image: "https://images.unsplash.com/photo-1761959150488-863999e308f9?w=400"
  },
  {
    id: "5",
    name: "Chinatown Complex Hawker Centre",
    type: "Hawker Centre",
    distance: 2.3,
    acceptedIngredients: ["Fresh Vegetables", "Eggs", "Tofu", "Noodles", "Bean Sprouts", "Mushrooms"],
    openHours: "Daily: 7am - 10pm",
    address: "335 Smith Street, Singapore 050335",
    image: "https://images.unsplash.com/photo-1750595372704-0894cc2a798c?w=400"
  },
  {
    id: "6",
    name: "Tiong Bahru Market",
    type: "Hawker Centre",
    distance: 2.8,
    acceptedIngredients: ["Fresh Vegetables", "Fruits", "Meat", "Seafood", "Herbs", "Spices"],
    openHours: "Daily: 6am - 9pm",
    address: "30 Seng Poh Road, Singapore 168898",
    image: "https://images.unsplash.com/photo-1598181052604-e0ded6143812?w=400"
  }
];

export function DonationScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [donationItems] = useState<DonationItem[]>(mockDonationItems);
  const [recipients] = useState<Recipient[]>(mockRecipients);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [filterType, setFilterType] = useState<"All" | "Community Centre" | "Hawker Centre" | "Food Bank">("All");

  const filteredRecipients = recipients
    .filter(recipient => {
      const matchesSearch = recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipient.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipient.acceptedIngredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterType === "All" || recipient.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => a.distance - b.distance);

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDonate = () => {
    if (selectedRecipient && selectedItems.length > 0) {
      toast.success(`Donation request sent to ${selectedRecipient.name}!`);
      setSelectedRecipient(null);
      setSelectedItems([]);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Community Centre":
        return "bg-blue-100 text-blue-700";
      case "Hawker Centre":
        return "bg-orange-100 text-orange-700";
      case "Food Bank":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Donate & Share</h1>
              <p className="text-gray-600 text-sm">Reduce waste, help others</p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>

          {/* Available for Donation */}
          {donationItems.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-semibold">{donationItems.length} items</span> available for donation
                  </p>
                </div>
                <div className="space-y-2">
                  {donationItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${
                        selectedItems.includes(item.id)
                          ? "bg-blue-100 border-blue-300"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.quantity}</p>
                      </div>
                      <Badge variant={item.expiryDays <= 1 ? "destructive" : "secondary"} className="text-xs">
                        {item.expiryDays}d left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", "Community Centre", "Hawker Centre", "Food Bank"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type as typeof filterType)}
                className="whitespace-nowrap"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipients List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="mb-2">
          <h2 className="text-sm font-medium text-gray-600 mb-1">
            {filteredRecipients.length} locations nearby
          </h2>
          <p className="text-xs text-gray-500">Sorted by distance</p>
        </div>

        {filteredRecipients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No locations found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecipients.map((recipient) => (
            <Card key={recipient.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    <ImageWithFallback
                      src={recipient.image}
                      alt={recipient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <h3 className="font-medium">{recipient.name}</h3>
                        <Badge className={`text-xs mt-1 ${getTypeColor(recipient.type)}`}>
                          {recipient.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span>{recipient.distance} km away</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>{recipient.openHours}</span>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-1">Accepts:</p>
                        <div className="flex flex-wrap gap-1">
                          {recipient.acceptedIngredients.slice(0, 3).map((ing, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ing}
                            </Badge>
                          ))}
                          {recipient.acceptedIngredients.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{recipient.acceptedIngredients.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-3" 
                      size="sm"
                      onClick={() => setSelectedRecipient(recipient)}
                      disabled={selectedItems.length === 0}
                    >
                      {selectedItems.length === 0 ? "Select items to donate" : "Donate Here"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Donation Confirmation Dialog */}
      <Dialog open={selectedRecipient !== null} onOpenChange={() => setSelectedRecipient(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Donation</DialogTitle>
            <DialogDescription>
              Review your donation details
            </DialogDescription>
          </DialogHeader>
          {selectedRecipient && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">{selectedRecipient.name}</h3>
                <p className="text-sm text-gray-600">{selectedRecipient.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getTypeColor(selectedRecipient.type)}>
                    {selectedRecipient.type}
                  </Badge>
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedRecipient.distance} km
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Items to donate:</h4>
                <div className="space-y-2">
                  {donationItems
                    .filter(item => selectedItems.includes(item.id))
                    .map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-600">{item.quantity}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.expiryDays}d left
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Open Hours:</span> {selectedRecipient.openHours}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Please drop off during operating hours
                </p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleDonate}>
                  Confirm Donation
                </Button>
                <Button variant="outline" onClick={() => setSelectedRecipient(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
