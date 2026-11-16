import React, { useState, useCallback } from 'react';
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/Navigation';
import { Doacao } from '../models/Doacao';
import { tema } from '../themes';
import { deletarDoacao, getDoacaoPorId } from '../service/doacaoService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalheDoacao'>;

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  const { id } = route.params;
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Busca na API sempre que a tela ganha foco, garantindo dados em tempo real
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function buscarDetalhes() {
        setCarregando(true);
        setErro(null);
        try {
          const dados = await getDoacaoPorId(id);
          if (ativo) setDoacao(dados);
        } catch (err: any) {
          if (ativo) {
            setErro('Doação não encontrada (404) ou erro de conexão.');
          }
        } finally {
          if (ativo) setCarregando(false);
        }
      }

      buscarDetalhes();
      return () => { ativo = false; };
    }, [id])
  );

  const confirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await deletarDoacao(id);
      Alert.alert('Sucesso', 'Doação excluída com sucesso.');
      navigation.goBack();
    } catch (err) {
      setExcluindo(false);
      // API desligada ao excluir: avisa e não finge que deu certo
      Alert.alert('Erro', 'A API recusou a exclusão ou está fora do ar. A doação não foi removida.');
    }
  };

  const handleSolicitarExclusao = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja apagar esta doação? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: confirmarExclusao },
      ]
    );
  };

  if (carregando) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color={tema.cores.primaria} />
        <Text style={styles.textoCarregando}>Buscando doação na API...</Text>
      </View>
    );
  }

  if (erro || !doacao) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <Ionicons name="alert-circle-outline" size={48} color="#C62828" />
        <Text style={styles.textoErro}>{erro || 'Doação não encontrada.'}</Text>
      </View>
    );
  }

  const dataFormatada = doacao.criadoEm 
    ? new Date(doacao.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    : 'Data não registrada';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{doacao.tipoItem}</Text>
        <View style={styles.divisor} />

        <View style={styles.linhaInfo}>
          <Text style={styles.rotulo}>Quantidade:</Text>
          <Text style={styles.valor}>{doacao.quantidade} unidades</Text>
        </View>

        {doacao.descricao ? (
          <View style={styles.linhaInfo}>
            <Text style={styles.rotulo}>Descrição:</Text>
            <Text style={styles.valor}>{doacao.descricao}</Text>
          </View>
        ) : null}

        <View style={styles.linhaInfo}>
          <Text style={styles.rotulo}>Ponto de Destino:</Text>
          <Text style={styles.valor}>{doacao.pontoDestino}</Text>
        </View>

        <View style={styles.linhaInfo}>
          <Text style={styles.rotulo}>Data de Registro:</Text>
          <Text style={styles.valor}>{dataFormatada}</Text>
        </View>
      </View>

      <View style={styles.containerAcoes}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('TelaFormularioDoacao', { doacaoParaEditar: doacao })}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={20} color="#FFF" />
          <Text style={styles.textoBotao}>Editar Doação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
          onPress={handleSolicitarExclusao}
          disabled={excluindo}
          activeOpacity={0.8}
        >
          {excluindo ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#FFF" />
              <Text style={styles.textoBotao}>Excluir Doação</Text>
            </>
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
  centralizado: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: {
    backgroundColor: tema.cores.cartao,
    padding: tema.espacamento.m,
    borderRadius: tema.bordas.padrao,
    borderColor: tema.cores.borda,
    borderWidth: 1,
    elevation: 2,
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
    flexDirection: 'row',
    backgroundColor: '#2980B9',
    minHeight: 48,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  botaoExcluir: {
    flexDirection: 'row',
    backgroundColor: tema.cores.perigo,
    minHeight: 48,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: tema.tipografia.peso.negrito,
  },
  textoCarregando: { marginTop: 12, color: tema.cores.textoSuave },
  textoErro: { color: '#C62828', fontSize: 16, textAlign: 'center', marginTop: 12 },
});