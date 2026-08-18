import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { pontosMock } from '../data/pontosMock';

export default function TelaListaPontos({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Locais de Coleta</Text>
      {pontosMock.map((ponto) => (
        <TouchableOpacity
          key={ponto.id}
          style={styles.card}
          onPress={() => navigation.navigate('DetalhePonto', { pontoId: ponto.id })}
        >
          <Text style={styles.titulo}>{ponto.nome}</Text>
          <Text style={styles.subTexto}>Toque para ver mais ›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 16 },
  card: { backgroundColor: '#FFF', padding: 16, marginBottom: 12, borderRadius: 8, elevation: 2 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subTexto: { fontSize: 12, color: '#7F8C8D', marginTop: 4 },
});