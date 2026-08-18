import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { pontosMock, Ponto } from '../data/pontosMock';

export default function TelaListaPontos({ navigation }: any) {
  
  // Função de renderização extraída para manter o JSX limpo e performático
  const renderizarPonto = ({ item }: { item: Ponto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
    >
      <Text style={styles.titulo}>{item.nome}</Text>
      <Text style={styles.subTexto}>Toque para ver mais ›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Locais de Coleta</Text>
      
      <FlatList
        data={pontosMock}
        keyExtractor={(item) => item.id}
        renderItem={renderizarPonto}
        // Propriedades recomendadas para performance
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 16 },
  card: { backgroundColor: '#FFF', padding: 16, marginBottom: 12, borderRadius: 8, elevation: 2 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subTexto: { fontSize: 12, color: '#7F8C8D', marginTop: 4 },
});