import { useEffect, useState } from "react"
import { FlatList, Text, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { Recipe } from "@/components/Recipe"
import { router, useLocalSearchParams } from "expo-router"

import { Ingredients } from "@/components/Ingredients"
import { Loading } from "@/components/Loading"
import { services } from "@/services"

import { styles } from "./styles"

export default function Recipes() {
  const [isLoading, setIsLoading] = useState(true)
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([])
  const [recipes, setRecipes] = useState<RecipeResponse[]>([])

  const params = useLocalSearchParams<{ingredientsIds: string}>()
  const ids = params.ingredientsIds.split(",")

  useEffect(() => {
    services.ingredients.findByIds(ids).then((res) => setIngredients(res)).finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    services.recipes.findByIngredientsIds(ids).then((res) => setRecipes(res)).finally(() => setIsLoading(false))
  }, [])


  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={32} onPress={() => router.back()} />
        <Text style={styles.title}>Ingredientes</Text>
      </View>

      <Ingredients ingredients={ingredients} />

      <FlatList 
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <Recipe recipe={item} onPress={() => router.navigate("/recipe/" + item.id)} />
        )}
        style={styles.recipes}
        contentContainerStyle={styles.recipesContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 16 }}
        numColumns={2}
      />
    </View>
  )
}