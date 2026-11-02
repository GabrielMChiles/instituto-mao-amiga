import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Troque para 'react-native-vector-icons/Ionicons' se não usar Expo
import { tema } from '../themes';

// Tipagem forte exigida para escalabilidade
interface BotaoComIconeProps extends TouchableOpacityProps {
  titulo?: string;
  nomeIcone: keyof typeof Ionicons.glyphMap;
  corFundo?: string;
  corTextoEIcone?: string;
  tamanhoIcone?: number;
  variante?: 'solido' | 'contorno' | 'fab'; // FAB = Floating Action Button
}

export function BotaoComIcone({
  titulo,
  nomeIcone,
  corFundo = '#27AE60',
  corTextoEIcone = '#FFF',
  tamanhoIcone = 24,
  variante = 'solido',
  style,
  ...rest
}: BotaoComIconeProps) {
  
  const isFab = variante === 'fab';
  const isContorno = variante === 'contorno';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.base,
        isFab && styles.fab,
        isContorno && { backgroundColor: 'transparent', borderColor: corFundo, borderWidth: 1 },
        !isContorno && !isFab && { backgroundColor: corFundo },
        style
      ]}
      {...rest}
    >
      <Ionicons 
        name={nomeIcone} 
        size={tamanhoIcone} 
        color={isContorno ? corFundo : corTextoEIcone} 
      />
      {titulo && !isFab && (
        <Text style={[
          styles.texto, 
          { color: isContorno ? corFundo : corTextoEIcone }
        ]}>
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // Acessibilidade: Touch target >= 44px
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  texto: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 4, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingHorizontal: 0, // Zera o padding para ficar redondo
    justifyContent: 'center',
  }
});