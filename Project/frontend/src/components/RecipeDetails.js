import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const RecipeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialRecipe = location.state?.recipe;
  // Get the flag to know if we came from the cookbook.
  const fromCookbook = location.state?.fromCookbook;
  const [currentRecipe, setCurrentRecipe] = useState(initialRecipe);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!currentRecipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-xl mb-4">No recipe data available.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  // Helper to get cookie value.
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Removed handleRegenerate function since we no longer need it.
  // const handleRegenerate = async () => { ... };

  // Save recipe (only available if not already saved).
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.post("/v1/profile/recipes/save", {
        recipe: currentRecipe,
        jwt: getCookie("jwt"),
      });
      console.log("Recipe saved successfully:", response.data);
      // After saving, navigate back to the cookbook.
      navigate("/cookbook");
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setSaving(false);
    }
  };

  // Safely process ingredients.
  const ingredientsStr = currentRecipe.ingredients_list || "";
  let rawIngredients = [];
  try {
    rawIngredients = JSON.parse(ingredientsStr);
    if (!Array.isArray(rawIngredients)) {
      rawIngredients = ingredientsStr.split(",").map((item) => item.trim());
    }
  } catch (err) {
    rawIngredients = ingredientsStr.split(",").map((item) => item.trim());
  }
  const ingredients = rawIngredients
    .map((item) =>
      item.replace(/[\[\]]+/g, "").replace(/^['"]+|['"]+$/g, "").trim()
    )
    .filter((item) => item !== "");

  // Safely process instructions.
  const instructionsStr = currentRecipe.instructions || "";
  const rawInstructions = instructionsStr
    .split("\n")
    .filter((line) => line.trim() !== "");
  const instructions = rawInstructions.map((line) =>
    line.replace(/^\s*\d+\.\s*/, "")
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-custom">
        <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-2xl text-darkerPurple">
          Loading your recipe...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {currentRecipe.recipe_name}
        </h1>

        {currentRecipe.image_url && (
          <img
            src={currentRecipe.image_url}
            alt={currentRecipe.recipe_name}
            className="w-full h-auto mb-6 rounded-lg object-cover"
          />
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b pb-1">
            Nutrition Facts
          </h2>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <strong>Calories:</strong> {currentRecipe.calories}
            </div>
            <div>
              <strong>Fat:</strong> {currentRecipe.fat} g
            </div>
            <div>
              <strong>Carbs:</strong> {currentRecipe.carbohydrates} g
            </div>
            <div>
              <strong>Protein:</strong> {currentRecipe.protein} g
            </div>
            <div>
              <strong>Cholesterol:</strong> {currentRecipe.cholesterol} mg
            </div>
            <div>
              <strong>Sodium:</strong> {currentRecipe.sodium} mg
            </div>
            <div>
              <strong>Fiber:</strong> {currentRecipe.fiber} g
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b pb-1">
            Ingredients
          </h2>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b pb-1">
            Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            {instructions.map((step, index) => (
              <li key={index} className="text-lg">
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {fromCookbook ? (
            <Link
              to="/cookbook"
              className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Back to Cookbook
            </Link>
          ) : (
            <Link
              to="/recipe/generate"
              className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Back to Generate Recipe
            </Link>
          )}
          {/* Only show save button if NOT coming from the cookbook */}
          {!fromCookbook && !currentRecipe.saved && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              {saving ? "Saving..." : "Save Recipe"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;