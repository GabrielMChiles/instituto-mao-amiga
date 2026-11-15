import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaListaPontos from './src/screens/TelaListaPontos';
import TelaDetalhePonto from './src/screens/TelaDetalhePonto';
import TelaFormularioDoacao from './src/screens/TelaFormularioDoacao';
import TelaHistoricoDoacoes from './src/screens/TelaHistoricoDoacoes';
import TelaDetalheDoacao from './src/screens/TelaDetalheDoacao';
import { RootStackParamList } from './src/navigation/Navigation';
import TelaFormularioPonto from './src/screens/TelaFormularioPonto';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="TelaListaPontos"
        screenOptions={{
          headerStyle: { backgroundColor: '#1B3A5C' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="TelaListaPontos" 
          component={TelaListaPontos} 
          options={{ title: 'Pontos de Coleta' }}
        />
        <Stack.Screen 
          name="TelaHistoricoDoacoes" 
          component={TelaHistoricoDoacoes} 
          options={{ title: 'Histórico de Doações' }}
        />
        <Stack.Screen 
          name="TelaFormularioDoacao" 
          component={TelaFormularioDoacao} 
        />
        <Stack.Screen 
          name="TelaDetalheDoacao" 
          component={TelaDetalheDoacao} 
          options={{ title: 'Detalhes da Doação' }}
        />
        <Stack.Screen 
          name="TelaDetalhePonto" 
          component={TelaDetalhePonto} 
          options={{ title: 'Detalhes do Ponto' }}
        />
        <Stack.Screen 
          name="TelaFormularioPonto" 
          component={TelaFormularioPonto} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}