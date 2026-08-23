import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { pontosMock, Ponto } from '../data/pontosMock';
import { SafeAreaView } from 'react-native-safe-area-context';

const normalizarString = (texto: string) => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

function PontoItem({ ponto, navigation }: { ponto: Ponto; navigation: any }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhePonto', { pontoId: ponto.id })}
      activeOpacity={0.8}
    >
      <Text style={styles.titulo}>{ponto.nome}</Text>
      <Text style={styles.textoSecundario}>📍 {ponto.endereco}</Text>
      <Text style={styles.textoSecundario}>📦 {ponto.itens}</Text>
      <Text style={styles.acaoTexto}>Toque para ver detalhes ›</Text>
    </TouchableOpacity>
  );
}

export default function TelaListaPontos({ navigation }: any) {
  const [inputBusca, setInputBusca] = useState('');
  const [termoDebounced, setTermoDebounced] = useState('');

  // Debounce de 400ms
  useEffect(() => {
    const handler = setTimeout(() => setTermoDebounced(inputBusca), 400);
    return () => clearTimeout(handler);
  }, [inputBusca]);

  // Filtro Composto (Nome OU Itens)
  const pontosFiltrados = useMemo(() => {
    if (!termoDebounced.trim()) return pontosMock;
    
    const buscaNorm = normalizarString(termoDebounced.trim());
    
    return pontosMock.filter(ponto => {
      const nomeNorm = normalizarString(ponto.nome);
      const itensNorm = normalizarString(ponto.itens);
      
      // Retorna true se a busca bater no nome OU nos itens
      return nomeNorm.includes(buscaNorm) || itensNorm.includes(buscaNorm);
    });
  }, [termoDebounced]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Locais de Coleta</Text>
        
        <TextInput
          style={styles.inputBusca}
          placeholder="Busque por ponto ou doação (ex: roupas)..."
          value={inputBusca}
          onChangeText={setInputBusca}
        />
        
        <FlatList
          data={pontosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PontoItem ponto={item} navigation={navigation} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>Nenhum local encontrado para "{termoDebounced}".</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex:1, backgroundColor: '#F5F5F5' },
  container: { flex: 1, padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 16 },
  inputBusca: {
    height: 50, backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 16
  },
  textoVazio: { textAlign: 'center', marginTop: 24, fontSize: 16, color: '#7F8C8D' },
  card: { backgroundColor: '#FFF', padding: 16, marginBottom: 12, borderRadius: 8, elevation: 2 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  textoSecundario: { fontSize: 14, color: '#4A4A4A', marginBottom: 2 },
  acaoTexto: { fontSize: 12, color: '#2980B9', marginTop: 8, fontWeight: 'bold' }
});