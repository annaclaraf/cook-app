import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';

import { styles } from './styles';
import { Ingredient } from '@/components/Ingredient';
import { Selected } from '@/components/Selected';
import { Loading } from '@/components/Loading';
import { router } from 'expo-router';
import { services } from '@/services';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]); 

  function handleClearSelected() {
    Alert.alert("Limpar", "Deseja limpar a seleção?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => setSelected([]),
      },
    ]);
  }

  function handleToggleSelected(value: string) {
    if (selected.includes(value)) {
      return setSelected((state) => state.filter((item) => item !== value))
    }

    setSelected((state) => [...state, value])
  }

  function handleSearch(){
    router.navigate('/recipes/' + selected )
  }

  useEffect(() => {
    services.ingredients.findAll().then(setIngredients).finally(() => setIsLoading(false))
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha {'\n'}<Text style={styles.subtitle}>os produtos</Text></Text>
      <Text style={styles.message}>Descubra receitas baseadas nos produtos que você escolheu.</Text>

      <ScrollView contentContainerStyle={styles.ingredient} showsVerticalScrollIndicator={false}>
        {ingredients.map(item => (
          <Ingredient
            key={item.id}
            name={item.name}
            image={`${services.storage.imagePath}/${item.image}`}
            selected={selected.includes(item.id)}
            onPress={() => handleToggleSelected(item.id)}
          />
        ))}
      </ScrollView>

      {selected.length > 0 &&
        <Selected
          quantity={selected.length}
          onClear={handleClearSelected}
          onSearch={handleSearch}
        />
      }
    </View>
  );
};
