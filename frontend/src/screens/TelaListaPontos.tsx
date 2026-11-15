import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
      setErro('Não foi possível conectar ao servidor. Verifique se a API está ativa.');
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  }, []);

  // useFocusEffect garante que ao voltar da tela de Edição/Cadastro, a lista reflete o banco real
  useFocusEffect(
    useCallback(() => {
      carregarDados(0, filtro, false);
    }, [filtro, carregarDados])
  );

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
      <View style={styles.cardHeader}>
        <Text style={styles.nomePonto}>{item.nome}</Text>
        <Text style={[styles.tipoBadge, item.tipo === 'COLETA' ? styles.badgeColeta : styles.badgeDistribuicao]}>
          {item.tipo}
        </Text>
      </View>
      <Text style={styles.detalhePonto}>Bairro: {item.bairro}</Text>
      <Text style={styles.detalhePonto}>Endereço: {item.endereco}</Text>
      <Text style={styles.detalhePonto}>Horário: {item.horario}</Text>
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
            activeOpacity={0.8}
          >
            <Ionicons name="heart-outline" size={18} color="#FFF" />
            <Text style={styles.textoBotaoHistorico}>Doações</Text>
          </TouchableOpacity>
        </View>

        {/* INPUT DE BUSCA */}
        <TextInput
          style={styles.inputBusca}
          placeholder="Filtrar por nome ou bairro..."
          placeholderTextColor={tema.cores.textoSuave}
          value={filtro}
          onChangeText={setFiltro}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        {/* BOTÃO DE CADASTRO ESTÁTICO (Substitui o FAB que quebrava na Web) */}
        <TouchableOpacity 
          style={styles.botaoCadastrarPonto}
          onPress={() => navigation.navigate('TelaFormularioPonto', undefined)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={20} color="#FFF" />
          <Text style={styles.textoBotaoCadastrar}>Cadastrar Novo Ponto</Text>
        </TouchableOpacity>

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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  container: { flex: 1, padding: tema.espacamento.m },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: tema.espacamento.m },
  titulo: { fontSize: 22, fontWeight: tema.tipografia.peso.negrito, color: tema.cores.textoForte },
  
  botaoHistorico: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tema.cores.primaria, 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: tema.bordas.padrao,
    gap: 6
  },
  textoBotaoHistorico: { color: '#FFF', fontWeight: 'bold' },

  inputBusca: {
    backgroundColor: tema.cores.cartao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    borderRadius: tema.bordas.padrao,
    padding: tema.espacamento.m,
    fontSize: tema.tipografia.tamanho.corpo,
    color: tema.cores.textoForte,
    marginBottom: tema.espacamento.p,
  },

  // BOTÃO PADRÃO ABAIXO DA BUSCA (Substitui o FAB desgovernado)
  botaoCadastrarPonto: {
    flexDirection: 'row',
    backgroundColor: tema.cores.sucesso,
    minHeight: 48,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tema.espacamento.m,
    gap: 8,
  },
  textoBotaoCadastrar: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nomePonto: { fontSize: tema.tipografia.tamanho.subtitulo, fontWeight: 'bold', color: tema.cores.textoForte, flex: 1 },
  tipoBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  badgeColeta: { backgroundColor: '#E8F6F3', color: '#27AE60' },
  badgeDistribuicao: { backgroundColor: '#EBF5FB', color: '#2980B9' },

  detalhePonto: { fontSize: tema.tipografia.tamanho.corpo, color: tema.cores.textoSuave, marginBottom: 2 },
  
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  textoCarregando: { marginTop: 12, color: tema.cores.textoSuave },
  textoVazio: { color: tema.cores.textoSuave, fontSize: tema.tipografia.tamanho.corpo, textAlign: 'center' },
  containerErro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  textoErro: { color: '#C62828', textAlign: 'center', marginBottom: 16, fontSize: tema.tipografia.tamanho.corpo },
  botaoRetry: { backgroundColor: tema.cores.primaria, paddingVertical: 10, paddingHorizontal: 20, borderRadius: tema.bordas.padrao },
  textoBotaoRetry: { color: '#FFF', fontWeight: 'bold' },
  footerLoader: { paddingVertical: 16, alignItems: 'center' },
  listaContainer: { paddingBottom: 40 }
});