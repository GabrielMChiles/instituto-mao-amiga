import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Platform, KeyboardAvoidingView, TextInput } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importe do tipo da stack

// Suas importações corrigidas
import { RootStackParamList } from '../navigation/Navigation';
import { listarDoacoes } from '../storage/doacoesStorage';
import { Ponto } from '../models/Ponto'; // O modelo que você passou o caminho
import { pontosMock } from '../data/pontosMock'; // O mock local
import { Doacao } from '../models/Doacao';
import ItemDoacao from '../components/ItemDoacao';
import { tema } from '../themes';
import { SafeAreaView } from 'react-native-safe-area-context';

type TelaHistoricoNavProp = NativeStackNavigationProp<RootStackParamList, 'TelaHistoricoDoacoes'>;

export default function TelaHistoricoDoacoes() {
  const navigation = useNavigation<TelaHistoricoNavProp>();
  
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  // DICIONÁRIO O(1): Evita buscar o nome do ponto em um loop na FlatList
  const [mapaPontos, setMapaPontos] = useState<Record<string, string>>({});
  
  // PROTEÇÃO DE I/O: Impede que a tela tente desenhar listas vazias enquanto o banco processa
  const [carregando, setCarregando] = useState(true);

  const [termoBusca, setTermoBusca] = useState('');

  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;

      async function carregarDados() {
        setCarregando(true);
        try {
          const historico = await listarDoacoes();
          
          if (!telaAtiva) return;

          const dicionario: Record<string, string> = {};
          pontosMock.forEach((ponto: Ponto) => {
             dicionario[ponto.id] = ponto.nome;
          });

          setMapaPontos(dicionario);
          setDoacoes(historico);
        } catch (error) {
          console.error("Erro ao ler banco de dados:", error);
        } finally {
          if (telaAtiva) setCarregando(false);
        }
      }

      carregarDados();
      return () => { telaAtiva = false; };
    }, [])
  );

  // 2. FILTRAGEM INSTANTÂNEA EM MEMÓRIA (Derived State)
  const doacoesFiltradas = useMemo(() => {
    // Retorno imediato (O(1)) se não houver busca
    if (!termoBusca.trim()) return doacoes;

    const termoNormalizado = termoBusca.toLowerCase().trim();

    return doacoes.filter((doacao) => 
      doacao.tipoItem?.toLowerCase().includes(termoNormalizado)
    );
  }, [doacoes, termoBusca]);

  if (carregando) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color={tema.cores.primaria} />
        <Text>Acessando banco de dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 3. PROTEÇÃO CONTRA O TECLADO (Requisito de Aceite) */}
      <KeyboardAvoidingView
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* CABEÇALHO COM A BUSCA */}
        <View style={styles.header}>
          <TextInput
            style={styles.inputBusca}
            placeholder="Buscar por tipo de item (ex: roupa)..."
            value={termoBusca}
            onChangeText={setTermoBusca}
            autoCorrect={false}
            clearButtonMode="while-editing" // Apenas iOS: adiciona o 'X' para limpar
          />
        </View>

        <TouchableOpacity 
          style={styles.botaoCadastro} 
          onPress={() => navigation.navigate('TelaFormularioDoacao')}
        >
          <Text style={styles.textoBotao}>+ Cadastrar Nova Doação</Text>
        </TouchableOpacity>
        
        <FlatList
          data={doacoesFiltradas}
          keyExtractor={(item) => item.id}
          // COMPORTAMENTO DO TECLADO: Oculta ao rolar, permite toques fora
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <ItemDoacao 
              doacao={item} 
              nomePontoDestino={mapaPontos[item.pontoDestinoId] || 'Ponto Desconhecido'} 
              onPress={() => navigation.navigate('TelaDetalheDoacao', { doacao: item })}
            />
          )}
          contentContainerStyle={doacoesFiltradas.length === 0 ? styles.listaVaziaContainer : styles.listaPreenchida}
          ListEmptyComponent={
            <View style={styles.listaVazia}>
               <Text style={styles.textoVazio}>
                 {termoBusca.trim() 
                   ? `Nenhuma doação encontrada para "${termoBusca}".` 
                   : 'Você ainda não registrou nenhuma doação.'}
               </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  safeArea: { 
      flex:1, 
      backgroundColor: tema.cores.fundo },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: tema.cores.fundo,
  },
  centralizado: { justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: tema.espacamento.m,
    paddingTop: tema.espacamento.m,
  },
  inputBusca: {
    backgroundColor: tema.cores.cartao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    borderRadius: tema.bordas.padrao,
    padding: tema.espacamento.m,
    fontSize: tema.tipografia.tamanho.corpo,
    color: tema.cores.textoForte,
  },
  botaoCadastro: {
    backgroundColor: tema.cores.sucesso,
    margin: tema.espacamento.m,
    minHeight: tema.acessibilidade.alvoMinimo,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: tema.cores.cartao,
    fontSize: tema.tipografia.tamanho.subtitulo,
    fontWeight: tema.tipografia.peso.negrito,
  },
  listaPreenchida: { paddingHorizontal: tema.espacamento.m, paddingBottom: tema.espacamento.g },
  listaVaziaContainer: { flexGrow: 1 },
  listaVazia: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tema.espacamento.g },
  textoVazio: { fontSize: tema.tipografia.tamanho.subtitulo, color: tema.cores.textoSuave, textAlign: 'center' },
});