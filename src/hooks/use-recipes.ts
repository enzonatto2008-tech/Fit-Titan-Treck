import { useState, useEffect } from 'react'
import { Recipe } from '@/types/fitness'
import { DEFAULT_RECIPES } from '@/data/recipes-database'

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('fit_recipes')
    return saved ? JSON.parse(saved) : DEFAULT_RECIPES
  })

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('fit_recipe_favorites')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('fit_recipes', JSON.stringify(recipes))
  }, [recipes])

  useEffect(() => {
    localStorage.setItem('fit_recipe_favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = { ...recipe, id: `recipe_${Date.now()}`, isCustom: true }
    setRecipes((prev) => [newRecipe, ...prev])
  }

  const isFavorite = (id: string) => favorites.includes(id)

  return { recipes, favorites, toggleFavorite, addRecipe, isFavorite }
}
