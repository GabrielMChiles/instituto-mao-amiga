import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { tema } from '../themes';
import { RootStackParamList } from '../navigation/Navigation';
import { Ponto } from '../models/Ponto';
import { listarPontosPaginados, ultimaPagina } from '../service/pontoService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaListaPontos'>;

export default function TelaListaPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [fimDaLista, setFimDaLista] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Função centralizada para carregar dados da API com tratamento de erros de rede
  const carregarDados = useCallback(async (paginaParaCarregar: number, termoBusca: string, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setCarregandoMais(true);
    } else {
      setCarregando(true);
      setErro(null);
    }

    try {
      const resposta = await listarPontosPaginados(paginaParaCarregar, termoBusca, 10);
      
      setPontos(prev => isLoadMore ? [...prev, ...resposta.content] : resposta.content);
      setFimDaLista(ultimaPagina(resposta));
      setPaginaAtual(resposta.page.number);
    } catch (err) {
      setErro('Não foi possível conectar ao servidor. Verifique se a API está ativa e sua conexão de rede.');
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  }, []);

  // Dispara a busca inicial ou quando o filtro muda (reseta para página 0)
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarDados(0, filtro, false);
    }, 400); // Debounce de 400ms para otimizar requisições de busca

    return () => clearTimeout(timer);
  }, [filtro, carregarDados]);

  // Handler para Rolagem Infinita (onEndReached)
  const lidarComFimDaLista = () => {
    if (carregando || carregandoMais || fimDaLista) return;
    carregarDados(paginaAtual + 1, filtro, true);
  };

  const renderItemPonto = ({ item }: { item: Ponto }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('TelaDetalhePonto', { id: item.id })}
      activeOpacity={0.7}
    >
      <Text style={styles.nomePonto}>{item.nome}</Text>
      <Text style={styles.detalhePonto}>Bairro: {item.bairro}</Text>
      <Text style={styles.detalhePonto}>Endereço: {item.endereco}</Text>
      <Text style={styles.tipoPonto}>Tipo: {item.tipo.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.titulo}>Pontos de Coleta</Text>
          <TouchableOpacity 
            style={styles.botaoHistorico}
            onPress={() => navigation.navigate('TelaHistoricoDoacoes')}
          >
            <Text style={styles.textoBotaoHistorico}>Doações</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.inputBusca}
          placeholder="Filtrar por nome ou bairro..."
          placeholderTextColor={tema.cores.textoSuave}
          value={filtro}
          onChangeText={setFiltro}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        {erro ? (
          <View style={styles.containerErro}>
            <Text style={styles.textoErro}>{erro}</Text>
            <TouchableOpacity style={styles.botaoRetry} onPress={() => carregarDados(0, filtro, false)}>
              <Text style={styles.textoBotaoRetry}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : carregando && pontos.length === 0 ? (
          <View style={styles.centralizado}>
            <ActivityIndicator size="large" color={tema.cores.primaria} />
            <Text style={styles.textoCarregando}>Carregando pontos da API...</Text>
          </View>
        ) : (
          <FlatList
            data={pontos}
            keyExtractor={(item) => item.id}
            renderItem={renderItemPonto}
            contentContainerStyle={styles.listaContainer}
            onEndReached={lidarComFimDaLista}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              carregandoMais ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color={tema.cores.primaria} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !carregando ? (
                <View style={styles.centralizado}>
                  <Text style={styles.textoVazio}>Nenhum ponto encontrado.</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ... dentro do StyleSheet.create da TelaListaPontos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  container: { flex: 1, padding: tema.espacamento.m },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: tema.espacamento.m },
  titulo: { fontSize: 22, fontWeight: tema.tipografia.peso.negrito, color: tema.cores.textoForte },
  botaoHistorico: { backgroundColor: tema.cores.primaria, paddingVertical: 8, paddingHorizontal: 12, borderRadius: tema.bordas.padrao },
  textoBotaoHistorico: { color: '#FFF', fontWeight: 'bold' },
  inputBusca: {
    backgroundColor: tema.cores.cartao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    borderRadius: tema.bordas.padrao,
    padding: tema.espacamento.m,
    fontSize: tema.tipografia.tamanho.corpo,
    color: tema.cores.textoForte,
    marginBottom: tema.espacamento.m,
  },
  card: {
    backgroundColor: tema.cores.cartao,
    borderRadius: tema.bordas.padrao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    padding: tema.espacamento.m,
    marginBottom: tema.espacamento.m,
    elevation: 1,
  },
  nomePonto: { fontSize: tema.tipografia.tamanho.subtitulo, fontWeight: 'bold', color: tema.cores.textoForte, marginBottom: 4 },
  detalhePonto: { fontSize: tema.tipografia.tamanho.corpo, color: tema.cores.textoSuave, marginBottom: 2 },
  tipoPonto: { fontSize: tema.tipografia.tamanho.pequeno, fontWeight: 'bold', color: tema.cores.sucesso, marginTop: 4 },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  textoCarregando: { marginTop: 12, color: tema.cores.textoSuave },
  textoVazio: { color: tema.cores.textoSuave, fontSize: tema.tipografia.tamanho.corpo, textAlign: 'center' },
  containerErro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  textoErro: { color: '#C62828', textAlign: 'center', marginBottom: 16, fontSize: tema.tipografia.tamanho.corpo },
  botaoRetry: { backgroundColor: tema.cores.primaria, paddingVertical: 10, paddingHorizontal: 20, borderRadius: tema.bordas.padrao },
  textoBotaoRetry: { color: '#FFF', fontWeight: 'bold' },
  footerLoader: { paddingVertical: 16, alignItems: 'center' },  
  listaContainer: { paddingBottom: tema.espacamento.g  }
});