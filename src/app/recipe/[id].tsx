import { useEffect, useState } from "react"
import { FlatList, Image, Text, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { Redirect, router, useLocalSearchParams } from "expo-router"

import { services } from "@/services"

import { Step } from "@/components/Step"
import { Loading } from "@/components/Loading"
import { Ingredients } from "@/components/Ingredients"

import { styles } from "./styles"

export default function Recipes() {
  const [isLoading, setIsLoading] = useState(true)
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([])
  const [preparations, setPreparations] = useState<PreparationsResponse[]>([])

  const { id } = useLocalSearchParams<{ id: string }>()

  useEffect(() => {
    services.recipes
      .show(id)
      .then((res) => setRecipe(res))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    services.ingredients
      .findByRecipeId(id)
      .then((res) => setIngredients(res))
  }, [])

  useEffect(() => {
    services.preparations
      .findByRecipeId(id)
      .then((res) => setPreparations(res))
  }, [])

  if (isLoading) {
    return <Loading />
  }

  if (!id || !recipe) {
    return <Redirect href="/" />
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />

      <View style={styles.body}>
        <View style={styles.header}>
          <MaterialIcons
            size={32}
            name="arrow-back"
            onPress={() => router.back()}
          />

          <Text style={styles.name}>{recipe.name}</Text>
          <Text style={styles.time}>{recipe.minutes} minutos de preparo</Text>
        </View>

        <Ingredients ingredients={ingredients} />

        <View style={styles.content}>
          <Text style={styles.preparation}>Modo de preparado</Text>

          <FlatList
            data={preparations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Step step={item.step} description={item.description} />
            )}
            contentContainerStyle={{ gap: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  )
}