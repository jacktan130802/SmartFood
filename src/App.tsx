import { useState } from "react";
import { Package, ChefHat, Heart, PieChart, ShoppingCart } from "lucide-react";
import { SmartPantryScreen } from "./components/SmartPantryScreen";
import { RecipeScreen } from "./components/RecipeScreen";
import { DonationScreen } from "./components/DonationScreen";
import { SmartPlateScreen } from "./components/SmartPlateScreen";
import { ShoppingScreen } from "./components/ShoppingScreen";
import { Toaster } from "./components/ui/sonner";

type Screen = "pantry" | "recipes" | "donation" | "analytics" | "shopping";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("pantry");

  const renderScreen = () => {
    switch (activeScreen) {
      case "pantry":
        return <SmartPantryScreen />;
      case "recipes":
        return <RecipeScreen />;
      case "donation":
        return <DonationScreen />;
      case "analytics":
        return <SmartPlateScreen />;
      case "shopping":
        return <ShoppingScreen />;
      default:
        return <SmartPantryScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1 p-2">
          <button
            onClick={() => setActiveScreen("pantry")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeScreen === "pantry"
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Package className="h-5 w-5 mb-1" />
            <span className="text-xs">Pantry</span>
          </button>

          <button
            onClick={() => setActiveScreen("recipes")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeScreen === "recipes"
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChefHat className="h-5 w-5 mb-1" />
            <span className="text-xs">Recipes</span>
          </button>

          <button
            onClick={() => setActiveScreen("donation")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeScreen === "donation"
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs">Donate</span>
          </button>

          <button
            onClick={() => setActiveScreen("analytics")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeScreen === "analytics"
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <PieChart className="h-5 w-5 mb-1" />
            <span className="text-xs">Analytics</span>
          </button>

          <button
            onClick={() => setActiveScreen("shopping")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
              activeScreen === "shopping"
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ShoppingCart className="h-5 w-5 mb-1" />
            <span className="text-xs">Shopping</span>
          </button>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
