import { useState } from "react";
import { ChefHat, Clock, Flame, Search, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Recipe {
  id: string;
  name: string;
  image: string;
  cookTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  matchingIngredients: string[];
  totalIngredients: number;
  priority: "high" | "medium" | "low";
  calories: number;
}

const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Spinach & Tomato Omelette",
    image: "https://images.unsplash.com/photo-1690896255756-6aaefe25d564?w=400",
    cookTime: 15,
    difficulty: "Easy",
    matchingIngredients: ["Spinach", "Cherry Tomatoes", "Cheddar Cheese"],
    totalIngredients: 5,
    priority: "high",
    calories: 320
  },
  {
    id: "2",
    name: "Greek Chicken Bowl",
    image: "https://images.unsplash.com/photo-1668665771757-4d42737d295a?w=400",
    cookTime: 30,
    difficulty: "Easy",
    matchingIngredients: ["Chicken Breast", "Cherry Tomatoes", "Greek Yogurt"],
    totalIngredients: 7,
    priority: "high",
    calories: 450
  },
  {
    id: "3",
    name: "Creamy Spinach Chicken",
    image: "https://images.unsplash.com/photo-1760390952135-12da7267ff8f?w=400",
    cookTime: 25,
    difficulty: "Medium",
    matchingIngredients: ["Chicken Breast", "Spinach", "Milk"],
    totalIngredients: 6,
    priority: "medium",
    calories: 380
  },
  {
    id: "4",
    name: "Tomato & Cheese Salad",
    image: "https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?w=400",
    cookTime: 10,
    difficulty: "Easy",
    matchingIngredients: ["Cherry Tomatoes", "Cheddar Cheese"],
    totalIngredients: 4,
    priority: "low",
    calories: 180
  }
];

export function RecipeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes] = useState<Recipe[]>(mockRecipes);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.matchingIngredients.some(ing => 
      ing.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const priorityRecipes = filteredRecipes.filter(r => r.priority === "high");

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Recipe Intelligence</h1>
              <p className="text-gray-600 text-sm">{recipes.length} recipes available</p>
            </div>
            <ChefHat className="h-8 w-8 text-primary" />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Priority Alert */}
          {priorityRecipes.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{priorityRecipes.length} recipes</span> use expiring items
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recipes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredRecipes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No recipes found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="relative h-48">
                <ImageWithFallback
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                {recipe.priority === "high" && (
                  <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Priority
                  </Badge>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white">{recipe.name}</h3>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookTime}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    <span>{recipe.calories} cal</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getDifficultyColor(recipe.difficulty)} text-white`}
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>

                {/* Ingredients Match */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Ingredients you have</span>
                    <span className="text-sm font-medium">
                      {recipe.matchingIngredients.length}/{recipe.totalIngredients}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.matchingIngredients.map((ing, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {ing}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
