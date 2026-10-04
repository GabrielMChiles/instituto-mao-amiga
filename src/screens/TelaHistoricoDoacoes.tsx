import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
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
  // DICIONÁRIO O(1): Evita buscar o nome do ponto em um loop custoso na FlatList
  const [mapaPontos, setMapaPontos] = useState<Record<string, string>>({});
  
  // PROTEÇÃO DE I/O: Impede que a tela tente desenhar listas vazias enquanto o banco processa
  const [carregando, setCarregando] = useState(true);

  // LIFECYCLE DE TELA: Garante que os dados sejam recarregados ao voltar da tela de Cadastro
  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true; // Evita memory leaks se o usuário mudar de tela muito rápido

      async function carregarDados() {
        setCarregando(true);
        try {
          // Busca de dados Assíncrona. 
          const [historico, pontos] = await Promise.all([
            listarDoacoes(),
            Promise.resolve(pontosMock as Ponto[]) // Simula latência de rede/banco
          ]);

          if (!telaAtiva) return;

          // Criação do dicionário em vez de usar .find() no renderItem
          const dicionario: Record<string, string> = {};
          pontos.forEach((ponto) => {
             dicionario[ponto.id] = ponto.nome;
          });

          setMapaPontos(dicionario);
          setDoacoes(historico);
        } catch (error) {
          // Em produção, nunca se engole exceções. Elas devem ser logadas para auditoria.
          console.error("Erro ao ler banco de dados:", error);
        } finally {
          if (telaAtiva) setCarregando(false);
        }
      }

      carregarDados();

      return () => { telaAtiva = false; };
    }, [])
  );

  // Feedback visual obrigatório enquanto a Promise não resolve
  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={tema.cores.primaria} />
        <Text>Acessando banco de dados...</Text>
      </View>
    );
  }

  return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.botaoCadastro} 
        onPress={() => navigation.navigate('TelaFormularioDoacao')}
      >
        <Text style={styles.textoBotao}>+ Cadastrar Nova Doação</Text>
      </TouchableOpacity>
      
      <FlatList
        data={doacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemDoacao 
            doacao={item} 
            // Acesso direto O(1) na memória. Muito mais rápido que array.find()
            nomePontoDestino={mapaPontos[item.pontoDestinoId] || 'Ponto Desconhecido'} 
          />
        )}
      />
    </View>
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
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoCadastro: {
    backgroundColor: tema.cores.sucesso,
    margin: tema.espacamento.m  ,
    minHeight: tema.acessibilidade.alvoMinimo,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  textoBotao: {
    color: tema.cores.cartao,
    fontSize: tema.tipografia.tamanho.subtitulo,
    fontWeight: tema.tipografia.peso.negrito,
  },
  listaPreenchida: {
    padding: tema.espacamento.m,
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tema.espacamento.g,
  },
    listaVaziaContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tema.espacamento.g,
  },
  textoVazio: {
    fontSize: tema.tipografia.tamanho.subtitulo,
    color: tema.cores.textoSuave,
    textAlign: 'center',
    marginTop: tema.espacamento.m,
  },
  botaoFlutuante: {
    position: 'absolute',
    bottom: tema.espacamento.g,
    right: tema.espacamento.g,
    backgroundColor: tema.cores.primaria,
    minWidth: tema.acessibilidade.alvoMinimo,
    minHeight: tema.acessibilidade.alvoMinimo,
    paddingHorizontal: tema.espacamento.m,
    paddingVertical: tema.espacamento.m,
    borderRadius: tema.bordas.arredondada,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  textoBotaoFlutuante: {
    color: tema.cores.cartao,
    fontWeight: tema.tipografia.peso.negrito,
    fontSize: tema.tipografia.tamanho.corpo,
  }
});