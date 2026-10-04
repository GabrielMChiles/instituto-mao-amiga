import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/Navigation';
import { Doacao } from '../models/Doacao';
import { excluirDoacao, obterDoacaoPorId } from '../storage/doacoesStorage';
import { pontosMock } from '../data/pontosMock';
import { tema } from '../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalheDoacao'>;

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  // 1. ESTADO LOCAL: Inicializa com o parâmetro de rota, mas permite reidratação reativa
  const [doacao, setDoacao] = useState<Doacao>(route.params.doacao);
  const [excluindo, setExcluindo] = useState(false);

  // 2. REIDRATAÇÃO DE ESTADO: Recarrega os dados do Storage sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;

      async function sincronizarDoacao() {
        const doacaoAtualizada = await obterDoacaoPorId(route.params.doacao.id);
        
        if (telaAtiva && doacaoAtualizada) {
          // Atualiza o estado local com os dados recém-salvos no AsyncStorage
          setDoacao(doacaoAtualizada);
        }
      }

      sincronizarDoacao();

      return () => {
        telaAtiva = false;
      };
    }, [route.params.doacao.id])
  );

  // RESOLUÇÃO DINÂMICA DO PONTO DE DESTINO
  const nomePontoDestino = useMemo(() => {
    const ponto = pontosMock.find((p) => p.id === doacao.pontoDestinoId);
    return ponto ? ponto.nome : 'Ponto não identificado';
  }, [doacao.pontoDestinoId]);

  // FORMATAÇÃO SEGURA DE DATA
  const dataFormatada = useMemo(() => {
    if (!doacao?.criadoEm) return 'Data não registrada';
    const data = new Date(doacao.criadoEm);
    return isNaN(data.getTime()) ? 'Data inválida' : data.toLocaleDateString('pt-BR');
  }, [doacao?.criadoEm]);

  async function confirmarExclusao() {
    setExcluindo(true);
    try {
      await excluirDoacao(doacao.id);
      navigation.goBack();
    } catch (error) {
      setExcluindo(false);
      Alert.alert(
        'Erro ao Excluir',
        'Ocorreu uma falha ao tentar remover a doação localmente. Tente novamente.'
      );
    }
  }

  function handleSolicitarExclusao() {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja apagar esta doação? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: confirmarExclusao },
      ]
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
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('TelaFormularioDoacao', { doacaoParaEditar: doacao })}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoEditar}>Editar Doação</Text>
        </TouchableOpacity>

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
  card: {
    backgroundColor: tema.cores.cartao,
    padding: tema.espacamento.m,
    borderRadius: tema.bordas.padrao,
    borderColor: tema.cores.borda,
    borderWidth: 1,
  },
  titulo: {
    fontSize: tema.tipografia.tamanho.titulo,
    fontWeight: tema.tipografia.peso.negrito,
    color: tema.cores.textoForte,
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
  },
  containerAcoes: {
    marginTop: tema.espacamento.xg,
    gap: tema.espacamento.p,
  },
  botaoEditar: {
    backgroundColor: tema.cores.aviso,
    minHeight: tema.acessibilidade.alvoMinimo,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoEditar: {
    color: tema.cores.cartao,
    fontSize: tema.tipografia.tamanho.subtitulo,
    fontWeight: tema.tipografia.peso.negrito,
  },
  botaoExcluir: {
    backgroundColor: tema.cores.perigo,
    minHeight: tema.acessibilidade.alvoMinimo,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
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