import { useState } from "react";
import { ChefHat, Clock, Flame, Search, Sparkles, ArrowLeft, Users } from "lucide-react";
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
  servings: number;
  allIngredients: { name: string; amount: string; hasIt: boolean }[];
  instructions: string[];
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
    calories: 320,
    servings: 2,
    allIngredients: [
      { name: "Spinach", amount: "100g", hasIt: true },
      { name: "Cherry Tomatoes", amount: "8-10 pieces", hasIt: true },
      { name: "Cheddar Cheese", amount: "50g", hasIt: true },
      { name: "Eggs", amount: "4 large", hasIt: false },
      { name: "Butter", amount: "2 tbsp", hasIt: false }
    ],
    instructions: [
      "Wash and chop the spinach and halve the cherry tomatoes.",
      "Beat the eggs in a bowl and season with salt and pepper.",
      "Heat butter in a pan over medium heat.",
      "Add spinach and tomatoes, cook for 2 minutes until spinach wilts.",
      "Pour in the eggs and swirl to cover the pan.",
      "Sprinkle grated cheese on top and cook for 3-4 minutes.",
      "Fold the omelette in half and serve warm."
    ]
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
    calories: 450,
    servings: 2,
    allIngredients: [
      { name: "Chicken Breast", amount: "300g", hasIt: true },
      { name: "Cherry Tomatoes", amount: "150g", hasIt: true },
      { name: "Greek Yogurt", amount: "100g", hasIt: true },
      { name: "Cucumber", amount: "1 medium", hasIt: false },
      { name: "Red Onion", amount: "1 small", hasIt: false },
      { name: "Lemon", amount: "1", hasIt: false },
      { name: "Olive Oil", amount: "2 tbsp", hasIt: false }
    ],
    instructions: [
      "Season chicken breast with salt, pepper, and oregano.",
      "Heat olive oil in a pan and cook chicken for 6-7 minutes per side.",
      "Let chicken rest, then slice into strips.",
      "Dice cucumber and red onion, halve cherry tomatoes.",
      "In a bowl, mix greek yogurt with lemon juice and garlic.",
      "Assemble bowls with sliced chicken, vegetables, and yogurt sauce.",
      "Drizzle with olive oil and serve."
    ]
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
    calories: 380,
    servings: 2,
    allIngredients: [
      { name: "Chicken Breast", amount: "300g", hasIt: true },
      { name: "Spinach", amount: "200g", hasIt: true },
      { name: "Milk", amount: "200ml", hasIt: true },
      { name: "Garlic", amount: "3 cloves", hasIt: false },
      { name: "Cream", amount: "100ml", hasIt: false },
      { name: "Parmesan", amount: "50g", hasIt: false }
    ],
    instructions: [
      "Season and pan-fry chicken breasts until golden brown.",
      "Remove chicken and set aside.",
      "In the same pan, sauté minced garlic until fragrant.",
      "Add spinach and cook until wilted.",
      "Pour in milk and cream, bring to a simmer.",
      "Add grated parmesan and stir until melted.",
      "Return chicken to pan and cook for 5 minutes in the sauce."
    ]
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
    calories: 180,
    servings: 2,
    allIngredients: [
      { name: "Cherry Tomatoes", amount: "200g", hasIt: true },
      { name: "Cheddar Cheese", amount: "100g", hasIt: true },
      { name: "Fresh Basil", amount: "handful", hasIt: false },
      { name: "Balsamic Vinegar", amount: "2 tbsp", hasIt: false }
    ],
    instructions: [
      "Wash and halve the cherry tomatoes.",
      "Cut cheddar cheese into small cubes.",
      "Tear fresh basil leaves into pieces.",
      "Combine tomatoes, cheese, and basil in a bowl.",
      "Drizzle with balsamic vinegar and olive oil.",
      "Season with salt and pepper, toss gently and serve."
    ]
  }
];

export function RecipeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes] = useState<Recipe[]>(mockRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

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

  // If a recipe is selected, show detail view
  if (selectedRecipe) {
    return (
      <div className="flex flex-col h-full bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="p-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRecipe(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl flex-1">{selectedRecipe.name}</h1>
          </div>
        </div>

        {/* Recipe Detail */}
        <div className="flex-1 overflow-y-auto">
          {/* Recipe Image */}
          <div className="relative h-64">
            <ImageWithFallback
              src={selectedRecipe.image}
              alt={selectedRecipe.name}
              className="w-full h-full object-cover"
            />
            {selectedRecipe.priority === "high" && (
              <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                <Sparkles className="h-3 w-3 mr-1" />
                Uses expiring items
              </Badge>
            )}
          </div>

          <div className="p-4 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">Cook Time</p>
                <p className="font-medium">{selectedRecipe.cookTime}m</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <Flame className="h-5 w-5 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">Calories</p>
                <p className="font-medium">{selectedRecipe.calories}</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">Servings</p>
                <p className="font-medium">{selectedRecipe.servings}</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <Badge className={`${getDifficultyColor(selectedRecipe.difficulty)} text-white`}>
                    {selectedRecipe.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Difficulty</p>
              </div>
            </div>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>
                  You have {selectedRecipe.matchingIngredients.length} of {selectedRecipe.totalIngredients} ingredients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedRecipe.allIngredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded ${
                        ingredient.hasIt ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          ingredient.hasIt ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className={ingredient.hasIt ? 'text-green-900' : 'text-gray-600'}>
                          {ingredient.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedRecipe.instructions.map((instruction, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                        {idx + 1}
                      </div>
                      <p className="flex-1 text-gray-700">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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

                <Button className="w-full" onClick={() => setSelectedRecipe(recipe)}>
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