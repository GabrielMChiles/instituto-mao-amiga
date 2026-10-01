import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaListaPontos from './src/screens/TelaListaPontos';
import TelaDetalhePonto from './src/screens/TelaDetalhePonto';
import TelaFormularioDoacao from './src/screens/TelaFormularioDoacao';
import { Doacao } from './src/models/Doacao';
import { doacoesMock } from './src/data/doacoesMock';
import { pontosMock } from './src/data/pontosMock';

export type RootStackParamList = {
  TelaListaPontos: undefined;
  TelaDetalhePonto: { pontoId: string };
  TelaFormularioDoacao: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [doacoes, setDoacoes] = useState<Doacao[]>(doacoesMock);

  function adicionarDoacao(novaDoacao: Doacao) {
    setDoacoes((estadoAtual) => [...estadoAtual, novaDoacao]);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaListaPontos">
        
        <Stack.Screen 
          name="TelaListaPontos" 
          component={TelaListaPontos} 
          options={{ title: 'Instituto Mão Amiga' }} 
        />

        <Stack.Screen 
          name="TelaFormularioDoacao" 
          options={{ title: 'Cadastre uma Doação' }}
        >
          {(props) => (
            <TelaFormularioDoacao 
              {...props} 
              pontos={pontosMock} 
              onAdicionarDoacao={adicionarDoacao}
            />
          )}
        </Stack.Screen>

        <Stack.Screen 
          name="TelaDetalhePonto" 
          options={{ title: 'Detalhes' }}
        >
          {/* INJEÇÃO DE DEPENDÊNCIA */}
          {(props) => <TelaDetalhePonto {...props} doacoes={doacoes} pontos={pontosMock} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}