import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TipoDoacao, OPCOES_TIPO_DOACAO, Doacao } from '../models/Doacao';
import { Ponto } from '../models/Ponto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salvarDoacao } from '../storage/doacoesStorage';

const CHAVE_RASCUNHO = '@mao_amiga:rascunho_doacao';

type Props = {
  navigation: any;
  pontos: Ponto[];
  onAdicionarDoacao: (doacao: Doacao) => void;
};

export default function TelaFormularioDoacao({ navigation, pontos, onAdicionarDoacao }: Props) {
  // Estados do Formulário
  const [tipoItem, setTipoItem] = useState<TipoDoacao | ''>('');
  const [pontoDestinoId, setPontoDestinoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
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
        console.error("Dado corrompido detectado no rascunho. Executando limpeza...", error);
        // Se falhou ao fazer a limpeza no disco, deleta a chave imediatamente.
        await AsyncStorage.removeItem(CHAVE_RASCUNHO).catch(e => 
          console.error("Falha catastrófica ao tentar limpar o disco", e)
        );
      }
    }
    carregarRascunho();
  }, []);

    // 2. SALVAR RASCUNHO AUTOMATICAMENTE (Com Debounce para proteger a performance)
    useEffect(() => {
    // Só salva se houver algo digitado (evita sobrescrever com vazio no primeiro render)
    if (!tipoItem && !pontoDestinoId && !quantidade && !descricao) return;

    // Debounce: Aguarda o usuário parar de digitar por 500ms antes de acessar o disco
    const timer = setTimeout(() => {
      const rascunho = { tipoItem, pontoDestinoId, quantidade, descricao };
      AsyncStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho)).catch(error => {
        console.error("Falha ao salvar rascunho:", error);
      });
    }, 500);

    // Função de limpeza do useEffect cancela o timer anterior se o usuário voltar a digitar
    return () => clearTimeout(timer);
  }, [tipoItem, pontoDestinoId, quantidade, descricao]);


  // Função Pura de Validação Estrutural
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
    await salvarDoacao({
      tipoItem: tipoItem as TipoDoacao,
      quantidade: Number(quantidade),
      pontoDestinoId,
      descricao: descricao.trim(),
    });

    // Limpa o rascunho temporário do formulário
    await AsyncStorage.removeItem(CHAVE_RASCUNHO);

    Keyboard.dismiss();
    navigation.goBack();
  } catch (err) {
    Alert.alert('Erro', 'Ocorreu uma falha ao salvar sua doação. Tente novamente.');
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* SEÇÃO 1: Tipo de Doação (Chips) */}
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

        {/* SEÇÃO 2: Destino (Chips Simples) */}
        <Text style={styles.label}>Para qual ponto de coleta?</Text>
        <View style={styles.chipContainer}>
          {pontos.map((ponto) => (
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

        {/* SEÇÃO 3: Quantidade e Descrição */}
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

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity style={styles.botaoSalvar} onPress={executarSalvamento}>
          <Text style={styles.textoBotao}>Confirmar Doação</Text>
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