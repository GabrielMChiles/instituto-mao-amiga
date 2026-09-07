import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pontosMock } from '../data/pontosMock';

export default function TelaDetalhePonto({ route }: any) {
  const { pontoId } = route.params;
  const ponto = pontosMock.find((p) => p.id === pontoId);

  // Caso não encontrar nenhum ponto
  if (!ponto) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.erroTexto}>Ponto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{ponto.nome}</Text>
        <Text style={styles.texto}>📍 {ponto.endereco}</Text>
        <Text style={styles.texto}>🕒 {ponto.horario}</Text>
        <Text style={styles.texto}>📦 {ponto.itens}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, elevation: 3 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 16 },
  texto: { fontSize: 16, color: '#4A4A4A', marginBottom: 10 },
  erroTexto: { fontSize: 18, color: '#E74C3C', fontWeight: 'bold' }
});