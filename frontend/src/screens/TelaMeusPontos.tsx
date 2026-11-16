import React, { useState, useCallback } from 'react';
import { 
  View, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/Navigation';
import { listarIdsFavoritos, removerFavorito } from '../storage/favoritosStorage';
import { tema } from '../themes';
import { Ponto } from '../models/Ponto';
import { getPontoPorId } from '../service/pontoService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaMeusPontos'>;

export default function TelaMeusPontos({ navigation }: Props) {
  const [pontosFavoritos, setPontosFavoritos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarFavoritos = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const idsSalvos = await listarIdsFavoritos();

      if (idsSalvos.length === 0) {
        setPontosFavoritos([]);
        setCarregando(false);
        return;
      }

      // Busca tolerante a falhas individuais (404 de pontos excluídos não derrubam a tela)
      const resultados = await Promise.allSettled(
        idsSalvos.map((id) => getPontoPorId(id))
      );

      const pontosValidos: Ponto[] = [];
      let houveFalhaDeRedeGeral = false;

      for (let i = 0; i < resultados.length; i++) {
        const res = resultados[i];
        const idCorrespondente = idsSalvos[i];

        if (res.status === 'fulfilled') {
          pontosValidos.push(res.value);
        } else {
          const msgErro = String(res.reason?.message || '');
          if (msgErro.includes('404')) {
            // Auto-higienização: ponto foi deletado da API, limpa do aparelho
            await removerFavorito(idCorrespondente);
          } else {
            houveFalhaDeRedeGeral = true;
          }
        }
      }

      if (pontosValidos.length === 0 && houveFalhaDeRedeGeral) {
        setErro('Não foi possível conectar ao servidor para validar seus favoritos.');
      } else {
        setPontosFavoritos(pontosValidos);
      }
    } catch (e) {
      setErro('Erro inesperado ao carregar seus pontos favoritos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos])
  );

  const handleDesmarcar = async (id: string) => {
    // Atualização otimista na UI + persistência no AsyncStorage
    setPontosFavoritos((prev) => prev.filter((p) => p.id !== id));
    await removerFavorito(id);
  };

  if (carregando) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centralizado]}>
        <ActivityIndicator size="large" color={tema.cores.primaria} />
        <Text style={styles.textoSuave}>Sincronizando favoritos com a API...</Text>
      </SafeAreaView>
    );
  }

  if (erro) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centralizado]}>
        <Ionicons name="cloud-offline-outline" size={48} color="#C62828" />
        <Text style={styles.textoErro}>{erro}</Text>
        <TouchableOpacity style={styles.botaoRetry} onPress={carregarFavoritos}>
          <Text style={styles.textoBotaoRetry}>Tentar Novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={pontosFavoritos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.cardConteudo}
              onPress={() => navigation.navigate('TelaDetalhePonto', { id: item.id })}
              activeOpacity={0.7}
            >
              <Text style={styles.nomePonto}>{item.nome}</Text>
              <Text style={styles.detalhePonto}>Bairro: {item.bairro}</Text>
              <Text style={styles.detalhePonto}>Endereço: {item.endereco}</Text>
              <Text style={styles.detalhePonto}>Horário: {item.horario}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoDesmarcar}
              onPress={() => handleDesmarcar(item.id)}
              activeOpacity={0.6}
              accessibilityLabel="Desmarcar favorito"
            >
              <Ionicons name="heart" size={26} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centralizadoVazio}>
            <Ionicons name="heart-dislike-outline" size={56} color={tema.cores.textoSuave} />
            <Text style={styles.tituloVazio}>Nenhum ponto favoritado</Text>
            <Text style={styles.textoSuave}>
              Toque no coração ao lado de um ponto na lista principal para salvá-lo aqui.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  listaContainer: { padding: tema.espacamento.m, flexGrow: 1 },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  centralizadoVazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: 40 },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tema.cores.cartao,
    borderRadius: tema.bordas.padrao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    marginBottom: tema.espacamento.m,
    elevation: 1,
  },
  cardConteudo: { flex: 1, padding: tema.espacamento.m },
  nomePonto: { fontSize: tema.tipografia.tamanho.subtitulo, fontWeight: 'bold', color: tema.cores.textoForte, marginBottom: 4 },
  detalhePonto: { fontSize: tema.tipografia.tamanho.corpo, color: tema.cores.textoSuave, marginBottom: 2 },
  botaoDesmarcar: {
    width: 52,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  tituloVazio: { fontSize: 18, fontWeight: 'bold', color: tema.cores.textoForte, marginTop: 12, marginBottom: 6 },
  textoSuave: { fontSize: 14, color: tema.cores.textoSuave, textAlign: 'center', marginTop: 8 },
  textoErro: { color: '#C62828', textAlign: 'center', marginVertical: 16, fontSize: 16 },
  botaoRetry: { backgroundColor: tema.cores.primaria, paddingVertical: 10, paddingHorizontal: 20, borderRadius: tema.bordas.padrao },
  textoBotaoRetry: { color: '#FFF', fontWeight: 'bold' },
});