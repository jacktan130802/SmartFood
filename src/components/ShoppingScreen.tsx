import { useState } from "react";
import { ShoppingCart, Plus, Check, Sparkles, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  priority: "suggested" | "needed" | "optional";
  reason?: string;
  checked: boolean;
}

const mockShoppingList: ShoppingItem[] = [
  {
    id: "1",
    name: "Eggs",
    quantity: "12 pack",
    category: "Dairy",
    priority: "suggested",
    reason: "Needed for 3 planned recipes",
    checked: false
  },
  {
    id: "2",
    name: "Onions",
    quantity: "500g",
    category: "Vegetables",
    priority: "suggested",
    reason: "Running low - used in 5 recipes",
    checked: false
  },
  {
    id: "3",
    name: "Olive Oil",
    quantity: "500ml",
    category: "Pantry",
    priority: "needed",
    reason: "Running out soon",
    checked: false
  },
  {
    id: "4",
    name: "Bell Peppers",
    quantity: "3 pieces",
    category: "Vegetables",
    priority: "suggested",
    reason: "For Greek Chicken Bowl recipe",
    checked: false
  },
  {
    id: "5",
    name: "Pasta",
    quantity: "500g",
    category: "Grains",
    priority: "optional",
    reason: "Stock up item",
    checked: false
  }
];

interface MealPlan {
  id: string;
  day: string;
  meal: string;
  recipe: string;
}

const mockMealPlan: MealPlan[] = [
  { id: "1", day: "Wed", meal: "Dinner", recipe: "Greek Chicken Bowl" },
  { id: "2", day: "Thu", meal: "Lunch", recipe: "Spinach Omelette" },
  { id: "3", day: "Fri", meal: "Dinner", recipe: "Creamy Spinach Chicken" }
];

export function ShoppingScreen() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(mockShoppingList);
  const [mealPlan] = useState<MealPlan[]>(mockMealPlan);
  const [newItem, setNewItem] = useState("");

  const toggleItem = (id: string) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addItem = () => {
    if (newItem.trim()) {
      const item: ShoppingItem = {
        id: Date.now().toString(),
        name: newItem,
        quantity: "1",
        category: "Other",
        priority: "optional",
        checked: false
      };
      setShoppingList(prev => [...prev, item]);
      setNewItem("");
    }
  };

  const suggestedItems = shoppingList.filter(i => i.priority === "suggested");
  const neededItems = shoppingList.filter(i => i.priority === "needed");
  const checkedCount = shoppingList.filter(i => i.checked).length;
  const totalCount = shoppingList.length;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "suggested":
        return <Badge className="bg-blue-500 hover:bg-blue-600">AI Suggested</Badge>;
      case "needed":
        return <Badge variant="destructive">Needed</Badge>;
      case "optional":
        return <Badge variant="secondary">Optional</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Smart Shopping</h1>
              <p className="text-gray-600 text-sm">
                {checkedCount}/{totalCount} items checked
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>

          {/* Add Item */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
            />
            <Button size="icon" onClick={addItem}>
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* AI Suggestions Alert */}
          {suggestedItems.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{suggestedItems.length} AI suggestions</span> based on your pantry
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Meal Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Meals
            </CardTitle>
            <CardDescription>Shopping list aligned with your meal plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mealPlan.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{meal.recipe}</p>
                  <p className="text-xs text-gray-600">
                    {meal.day} • {meal.meal}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Planned</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shopping List */}
        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-3">Shopping List</h2>
          
          {/* Needed Items */}
          {neededItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Must Buy</h3>
              <div className="space-y-2">
                {neededItems.map((item) => (
                  <Card key={item.id} className="border-red-200">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`font-medium ${item.checked ? 'line-through text-gray-400' : ''}`}>
                              {item.name}
                            </h3>
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-sm text-gray-600">{item.quantity}</p>
                          {item.reason && (
                            <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Items */}
          {suggestedItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">AI Recommended</h3>
              <div className="space-y-2">
                {suggestedItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`font-medium ${item.checked ? 'line-through text-gray-400' : ''}`}>
                              {item.name}
                            </h3>
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-sm text-gray-600">{item.quantity}</p>
                          {item.reason && (
                            <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                              <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {item.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Optional Items */}
          {shoppingList.filter(i => i.priority === "optional").length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Optional</h3>
              <div className="space-y-2">
                {shoppingList
                  .filter(i => i.priority === "optional")
                  .map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className={`font-medium ${item.checked ? 'line-through text-gray-400' : ''}`}>
                                {item.name}
                              </h3>
                              {getPriorityBadge(item.priority)}
                            </div>
                            <p className="text-sm text-gray-600">{item.quantity}</p>
                            {item.reason && (
                              <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
