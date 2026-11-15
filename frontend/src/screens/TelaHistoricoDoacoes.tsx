import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/Navigation';
import { tema } from '../themes';
import { listarDoacoesPaginadas, ultimaPaginaDoacoes } from '../service/doacaoService';
import { Doacao } from '../models/Doacao';

type TelaHistoricoNavProp = NativeStackNavigationProp<RootStackParamList, 'TelaHistoricoDoacoes'>;

export default function TelaHistoricoDoacoes() {
  const navigation = useNavigation<TelaHistoricoNavProp>();
  
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [fimDaLista, setFimDaLista] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = useCallback(async (paginaParaCarregar: number, termo: string, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setCarregandoMais(true);
    } else {
      setCarregando(true);
      setErro(null);
    }

    try {
      const resposta = await listarDoacoesPaginadas(paginaParaCarregar, termo, 10);
      setDoacoes(prev => isLoadMore ? [...prev, ...resposta.content] : resposta.content);
      setFimDaLista(ultimaPaginaDoacoes(resposta));
      setPaginaAtual(resposta.page.number);
    } catch (err) {
      setErro('Não foi possível conectar ao servidor para carregar as doações.');
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados(0, termoBusca, false);
    }, [termoBusca, carregarDados])
  );

  const lidarComFimDaLista = () => {
    if (carregando || carregandoMais || fimDaLista) return;
    carregarDados(paginaAtual + 1, termoBusca, true);
  };

  const renderItemDoacao = ({ item }: { item: Doacao }) => {
    const dataFormatada = new Date(item.criadoEm).toLocaleDateString('pt-BR');
    
    return (
      <TouchableOpacity 
        style={styles.cardDoacao}
        onPress={() => navigation.navigate('TelaDetalheDoacao', { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.tipoItem}>{item.tipoItem}</Text>
          <Text style={styles.quantidadeBadge}>{item.quantidade} un.</Text>
        </View>
        <Text style={styles.pontoDestino}>Destino: {item.pontoDestino}</Text>
        <Text style={styles.dataRegistro}>Registrado em: {dataFormatada}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.tituloSecao}>HISTÓRICO DE DOAÇÕES (API)</Text>

          <View style={styles.linhaBuscaECadastro}>
            <TextInput
              style={styles.inputBusca}
              placeholder="Filtrar por tipo de item..."
              placeholderTextColor={tema.cores.textoSuave}
              value={termoBusca}
              onChangeText={setTermoBusca}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />

            <TouchableOpacity 
              style={styles.botaoCadastrar} 
              onPress={() => navigation.navigate('TelaFormularioDoacao')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {erro ? (
          <View style={styles.centralizado}>
            <Text style={styles.textoErro}>{erro}</Text>
            <TouchableOpacity style={styles.botaoRetry} onPress={() => carregarDados(0, termoBusca, false)}>
              <Text style={styles.textoBotaoRetry}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : carregando && doacoes.length === 0 ? (
          <View style={styles.centralizado}>
            <ActivityIndicator size="large" color={tema.cores.primaria} />
            <Text style={styles.textoCarregando}>Buscando doações na API...</Text>
          </View>
        ) : (
          <FlatList
            data={doacoes}
            keyExtractor={(item) => item.id}
            renderItem={renderItemDoacao}
            contentContainerStyle={styles.containerListaBase}
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
                <View style={styles.listaVazia}>
                  <Text style={styles.textoVazio}>Nenhuma doação registrada na API.</Text>
                </View>
              ) : null
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  container: { flex: 1, backgroundColor: tema.cores.fundo },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  textoCarregando: { marginTop: 8, color: tema.cores.textoSuave },
  headerContainer: { padding: tema.espacamento.m },
  tituloSecao: { fontSize: tema.tipografia.tamanho.pequeno, fontWeight: 'bold', color: tema.cores.textoSuave, marginBottom: 12 },
  linhaBuscaECadastro: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  inputBusca: {
    flex: 1,
    height: 48,
    backgroundColor: tema.cores.cartao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    borderRadius: tema.bordas.padrao,
    paddingHorizontal: 12,
    fontSize: 16,
    color: tema.cores.textoForte,
  },
  botaoCadastrar: {
    width: 48,
    height: 48,
    backgroundColor: tema.cores.sucesso,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDoacao: {
    backgroundColor: tema.cores.cartao,
    borderRadius: tema.bordas.padrao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    padding: tema.espacamento.m,
    marginBottom: tema.espacamento.m,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  tipoItem: { fontSize: 18, fontWeight: 'bold', color: tema.cores.textoForte },
  quantidadeBadge: { fontSize: 14, fontWeight: 'bold', color: tema.cores.sucesso, backgroundColor: '#E8F6F3', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 12 },
  pontoDestino: { fontSize: 14, color: tema.cores.textoSuave, marginBottom: 2 },
  dataRegistro: { fontSize: 12, color: tema.cores.textoSuave },
  containerListaBase: { paddingHorizontal: tema.espacamento.m, paddingBottom: 40 },
  listaVazia: { paddingVertical: 40, alignItems: 'center' },
  textoVazio: { fontSize: 16, color: tema.cores.textoSuave },
  textoErro: { color: '#C62828', textAlign: 'center', marginBottom: 16, fontSize: 16 },
  botaoRetry: { backgroundColor: tema.cores.primaria, paddingVertical: 10, paddingHorizontal: 20, borderRadius: tema.bordas.padrao },
  textoBotaoRetry: { color: '#FFF', fontWeight: 'bold' },
  footerLoader: { paddingVertical: 16, alignItems: 'center' },
});