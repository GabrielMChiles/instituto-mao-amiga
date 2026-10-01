import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ponto } from '../models/Ponto';
import { Doacao } from '../models/Doacao';

// CONTRATO ESTRITO: Fim da era do 'any'
type Props = {
  route: {
    params: {
      pontoId: string;
    };
  };
  pontos: Ponto[];
  doacoes: Doacao[];
};

export default function TelaDetalhePonto({ route, pontos, doacoes }: Props) {
  const { pontoId } = route.params;

  // Busca o ponto na lista injetada (Fonte de Verdade)
  const ponto = pontos.find((p) => p.id === pontoId);

  // Filtro de Performance: Acha as doações APENAS deste ponto
  const estoqueLocal = useMemo(() => {
    return doacoes.filter((d) => d.pontoDestinoId === pontoId);
  }, [doacoes, pontoId]);

  // Null Pointer Defense
  if (!ponto) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.erroTexto}>Ponto de coleta não encontrado.</Text>
      </View>
    );
  }

  // Renderizador individual do item de estoque
  const renderItemEstoque = ({ item }: { item: Doacao }) => (
    <View style={styles.itemEstoque}>
      <Text style={styles.textoForte}>{item.tipoItem}</Text>
      <Text style={styles.texto}>Qtd: {item.quantidade}</Text>
      <Text style={styles.textoDescricao}>{item.descricao}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* SEÇÃO 1: Dados do Ponto */}
      <View style={styles.card}>
        <Text style={styles.titulo}>{ponto.nome}</Text>
        <Text style={styles.texto}>📍 {ponto.endereco}</Text>
        <Text style={styles.texto}>🕒 {ponto.horario}</Text>
      </View>

      {/* SEÇÃO 2: Lista de Estoque (Relacionamento 1 para N) */}
      <Text style={styles.subtitulo}>Estoque Atual de Doações</Text>
      <FlatList
        data={estoqueLocal}
        keyExtractor={(item) => item.id}
        renderItem={renderItemEstoque}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.textoVazio}>Nenhuma doação registrada para este local ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, elevation: 3, marginBottom: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 12 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 12, marginTop: 8 },
  texto: { fontSize: 16, color: '#4A4A4A', marginBottom: 4 },
  textoForte: { fontSize: 16, fontWeight: 'bold', color: '#27AE60', marginBottom: 4 },
  textoDescricao: { fontSize: 14, color: '#7F8C8D', fontStyle: 'italic', marginTop: 4 },
  textoVazio: { textAlign: 'center', color: '#7F8C8D', marginTop: 20, fontSize: 15 },
  erroTexto: { fontSize: 18, color: '#E74C3C', fontWeight: 'bold' },
  itemEstoque: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 8 }
});