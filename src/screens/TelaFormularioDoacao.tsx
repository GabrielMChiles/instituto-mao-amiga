import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Alert, Keyboard, StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../navigation/Navigation';
import { Doacao, TipoDoacao } from '../models/Doacao';
import { Ponto } from '../models/Ponto';
import { salvarDoacao, atualizarDoacao } from '../storage/doacoesStorage';
import { pontosMock } from '../data/pontosMock';
import { tema } from '../themes';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaFormularioDoacao'>;

const CHAVE_RASCUNHO = '@mao_amiga:rascunho_doacao';

const OPCOES_TIPO_DOACAO: { label: string; value: TipoDoacao }[] = [
  { label: 'Alimento', value: 'ALIMENTO' },
  { label: 'Roupas', value: 'ROUPA' },
  { label: 'Brinquedos', value: 'BRINQUEDO' },
  { label: 'Outros', value: 'OUTRO' },
];

export default function TelaFormularioDoacao({ route, navigation }: Props) {
  const doacaoParaEditar = route.params?.doacaoParaEditar;
  const modoEdicao = Boolean(doacaoParaEditar);

  // Inicialização de Estado Condicional (Edição vs Novo Registro)
  const [tipoItem, setTipoItem] = useState<TipoDoacao | ''>(doacaoParaEditar?.tipoItem || '');
  const [pontoDestinoId, setPontoDestinoId] = useState(doacaoParaEditar?.pontoDestinoId || '');
  const [quantidade, setQuantidade] = useState(doacaoParaEditar ? String(doacaoParaEditar.quantidade) : '');
  const [descricao, setDescricao] = useState(doacaoParaEditar?.descricao || '');
  const [erro, setErro] = useState('');

  // 1. TÍTULO DINÂMICO DA TELA
  useLayoutEffect(() => {
    navigation.setOptions({
      title: modoEdicao ? 'Editar Doação' : 'Cadastrar Doação',
    });
  }, [navigation, modoEdicao]);

  // 2. CARREGAR RASCUNHO (Apenas no Modo Cadastro)
  useEffect(() => {
    if (modoEdicao) return; // ISOLAMENTO: Não carrega rascunho se for edição!

    async function carregarRascunho() {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE_RASCUNHO);
        if (!salvo) return;

        const rascunho = JSON.parse(salvo);
        setTipoItem(rascunho.tipoItem || '');
        setPontoDestinoId(rascunho.pontoDestinoId || '');
        setQuantidade(rascunho.quantidade || '');
        setDescricao(rascunho.descricao || '');
      } catch (error) {
        await AsyncStorage.removeItem(CHAVE_RASCUNHO).catch(() => {});
      }
    }
    carregarRascunho();
  }, [modoEdicao]);

  // 3. SALVAR RASCUNHO AUTOMÁTICO (Apenas no Modo Cadastro)
  useEffect(() => {
    if (modoEdicao) return; // ISOLAMENTO: Não salva rascunho se for edição!
    if (!tipoItem && !pontoDestinoId && !quantidade && !descricao) return;

    const timer = setTimeout(() => {
      const rascunho = { tipoItem, pontoDestinoId, quantidade, descricao };
      AsyncStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho)).catch(() => {});
    }, 500);

    return () => clearTimeout(timer);
  }, [tipoItem, pontoDestinoId, quantidade, descricao, modoEdicao]);

  const validarFormulario = (): boolean => {
    if (!tipoItem) {
      setErro('Selecione o tipo de doação.');
      return false;
    }
    if (!pontoDestinoId) {
      setErro('Selecione o ponto de destino.');
      return false;
    }
    
    const qtdNum = Number(quantidade);
    if (!quantidade.trim() || !Number.isInteger(qtdNum) || qtdNum <= 0) {
      setErro('A quantidade deve ser um número inteiro maior que zero.');
      return false;
    }
    
    if (!descricao.trim()) {
      setErro('Forneça uma breve descrição do item.');
      return false;
    }

    setErro('');
    return true;
  };

  const executarSalvamento = async () => {
    if (!validarFormulario()) return;

    try {
      if (modoEdicao && doacaoParaEditar) {
        // FLUXO DE ATUALIZAÇÃO
        const doacaoAtualizada: Doacao = {
          ...doacaoParaEditar, // Preserva id e data de criação originais
          tipoItem: tipoItem as TipoDoacao,
          pontoDestinoId,
          quantidade: Number(quantidade),
          descricao: descricao.trim(),
        };
        await atualizarDoacao(doacaoAtualizada);
      } else {
        // FLUXO DE CRIAÇÃO
        await salvarDoacao({
          tipoItem: tipoItem as TipoDoacao,
          quantidade: Number(quantidade),
          pontoDestinoId,
          descricao: descricao.trim(),
        });
        // Limpa o rascunho após salvar o novo item
        await AsyncStorage.removeItem(CHAVE_RASCUNHO);
      }

      Keyboard.dismiss();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Ocorreu uma falha ao salvar sua doação. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.label}>O que você quer doar?</Text>
        <View style={styles.chipContainer}>
          {OPCOES_TIPO_DOACAO.map((opcao) => (
            <TouchableOpacity
              key={opcao.value}
              style={[styles.chip, tipoItem === opcao.value && styles.chipSelecionado]}
              onPress={() => setTipoItem(opcao.value)}
            >
              <Text style={[styles.chipTexto, tipoItem === opcao.value && styles.chipTextoSelecionado]}>
                {opcao.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Quantidade (Unidades)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 5"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Descrição Adicional</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Camisetas infantis tamanho M, bem conservadas."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
        />


        <Text style={styles.label}>Para qual ponto de coleta?</Text>
        <View style={styles.chipContainer}>
          {pontosMock.map((ponto: Ponto) => (
            <TouchableOpacity
              key={ponto.id}
              style={[styles.chip, pontoDestinoId === ponto.id && styles.chipSelecionado]}
              onPress={() => setPontoDestinoId(ponto.id)}
            >
              <Text style={[styles.chipTexto, pontoDestinoId === ponto.id && styles.chipTextoSelecionado]}>
                {ponto.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>


        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity style={styles.botaoSalvar} onPress={executarSalvamento}>
          <Text style={styles.textoBotao}>
            {modoEdicao ? 'Salvar Alterações' : 'Confirmar Doação'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { padding: 16 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#E0E0E0', borderWidth: 1, borderColor: 'transparent' },
  chipSelecionado: { backgroundColor: '#E8F6F3', borderColor: '#27AE60' },
  chipTexto: { color: '#333', fontSize: 14 },
  chipTextoSelecionado: { color: '#27AE60', fontWeight: 'bold' },
  botaoSalvar: { backgroundColor: '#27AE60', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  erro: { color: '#C62828', marginTop: 12, fontWeight: 'bold', textAlign: 'center' }
});