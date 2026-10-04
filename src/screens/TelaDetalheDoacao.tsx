import React, { useState, useMemo } from 'react';
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { excluirDoacao } from '../storage/doacoesStorage';
import { pontosMock } from '../data/pontosMock';
import { RootStackParamList } from '../navigation/Navigation';
import { tema } from '../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalheDoacao'>;

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  const { doacao } = route.params;
  const [excluindo, setExcluindo] = useState(false);

  // RESOLUÇÃO DE NOME DO PONTO: Dicionário em memória O(1)
  const nomePontoDestino = useMemo(() => {
    const ponto = pontosMock.find((p) => p.id === doacao.pontoDestinoId);
    return ponto ? ponto.nome : 'Ponto não identificado';
  }, [doacao.pontoDestinoId]);

  // FORMATAÇÃO SEGURA DE DATA (Null Pointer Defense)
  const dataFormatada = useMemo(() => {
    if (!doacao?.criadoEm) return 'Data não registrada';
    const data = new Date(doacao.criadoEm);
    return isNaN(data.getTime()) ? 'Data inválida' : data.toLocaleDateString('pt-BR');
  }, [doacao?.criadoEm]);

  // AÇÃO DE EXCLUSÃO COM TRATAMENTO DE ERRO E PESSIMISTIC UI
  async function confirmarExclusao() {
    setExcluindo(true);
    try {
      await excluirDoacao(doacao.id);
      // Retorna ao histórico apenas após sucesso confirmado no disco
      navigation.goBack();
    } catch (error) {
      setExcluindo(false);
      Alert.alert(
        'Erro ao Excluir',
        'Ocorreu uma falha ao tentar remover a doação do armazenamento local. Tente novamente.'
      );
    }
  }

  function handleSolicitarExclusao() {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja apagar esta doação do seu histórico? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: confirmarExclusao 
        },
      ]
    );
  }

  // Null Pointer Defense caso o parâmetro chegue corrompido
  if (!doacao) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <Text style={styles.textoErro}>Erro ao carregar detalhes da doação.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{doacao.tipoItem}</Text>
        
        <View style={styles.divisor} />

        <View style={styles.linhaInfo}>
          <Text style={styles.rotulo}>Quantidade:</Text>
          <Text style={styles.valor}>{doacao.quantidade}</Text>
        </View>

        <View style={styles.linhaInfo}>
          <Text style={styles.rotulo}>Descrição:</Text>
          <Text style={styles.valor}>{doacao.descricao}</Text>
        </View>

        <View style={styles.linhaInfo}>
          <Text style={styles.rotulo}>Ponto de Destino:</Text>
          <Text style={styles.valor}>{nomePontoDestino}</Text>
        </View>

        <View style={styles.linhaInfo}>
          <Text style={styles.rotulo}>Data de Registro:</Text>
          <Text style={styles.valor}>{dataFormatada}</Text>
        </View>
      </View>

      {/* ÁREA DE AÇÕES */}
      <View style={styles.containerAcoes}>
        <TouchableOpacity
          style={[styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
          onPress={handleSolicitarExclusao}
          disabled={excluindo}
          activeOpacity={0.8}
        >
          {excluindo ? (
            <ActivityIndicator color={tema.cores.cartao} />
          ) : (
            <Text style={styles.textoBotaoExcluir}>Excluir Doação</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tema.cores.fundo,
    padding: tema.espacamento.m,
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoErro: {
    color: tema.cores.perigo,
    fontSize: tema.tipografia.tamanho.subtitulo,
  },
  card: {
    backgroundColor: tema.cores.cartao,
    padding: tema.espacamento.m,
    borderRadius: tema.bordas.padrao,
    borderColor: tema.cores.borda,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titulo: {
    fontSize: tema.tipografia.tamanho.titulo,
    fontWeight: tema.tipografia.peso.negrito,
    color: tema.cores.textoForte,
    marginBottom: tema.espacamento.p,
  },
  divisor: {
    height: 1,
    backgroundColor: tema.cores.borda,
    marginVertical: tema.espacamento.p,
  },
  linhaInfo: {
    marginVertical: 6,
  },
  rotulo: {
    fontSize: tema.tipografia.tamanho.pequeno,
    color: tema.cores.textoSuave,
  },
  valor: {
    fontSize: tema.tipografia.tamanho.subtitulo,
    color: tema.cores.textoForte,
    fontWeight: '500',
  },
  containerAcoes: {
    marginTop: tema.espacamento.xg,
  },
  botaoExcluir: {
    backgroundColor: tema.cores.perigo,
    minHeight: tema.acessibilidade.alvoMinimo,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoExcluir: {
    color: tema.cores.cartao,
    fontSize: tema.tipografia.tamanho.subtitulo,
    fontWeight: tema.tipografia.peso.negrito,
  },
});