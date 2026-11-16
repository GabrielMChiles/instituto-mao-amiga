import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Alert, Keyboard, StyleSheet, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/Navigation';
import { tema } from '../themes';
import { Ponto } from '../models/Ponto';
import { atualizarDoacao, criarDoacao } from '../service/doacaoService';
import { listarPontosPaginados } from '../service/pontoService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaFormularioDoacao'>;

const OPCOES_TIPO_DOACAO = ['Alimento', 'Roupas', 'Brinquedos', 'Outros'];

export default function TelaFormularioDoacao({ route, navigation }: Props) {
  const doacaoParaEditar = route.params?.doacaoParaEditar;
  const modoEdicao = Boolean(doacaoParaEditar);

  const [tipoItem, setTipoItem] = useState(doacaoParaEditar?.tipoItem || '');
  const [pontoDestino, setPontoDestino] = useState(doacaoParaEditar?.pontoDestino || '');
  const [quantidade, setQuantidade] = useState(doacaoParaEditar ? String(doacaoParaEditar.quantidade) : '');
  
  const [pontosDisponiveis, setPontosDisponiveis] = useState<Ponto[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);
  const [carregandoSalvar, setCarregandoSalvar] = useState(false);
  const [erro, setErro] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: modoEdicao ? 'Editar Doação' : 'Cadastrar Doação',
    });
  }, [navigation, modoEdicao]);

  // Carrega os pontos de coleta direto da API do Spring Boot
  useEffect(() => {
    async function carregarPontosApi() {
      try {
        const resposta = await listarPontosPaginados(0, '', 50);
        setPontosDisponiveis(resposta.content);
      } catch (err) {
        Alert.alert('Aviso', 'Não foi possível carregar os pontos de coleta da API.');
      } finally {
        setCarregandoPontos(false);
      }
    }
    carregarPontosApi();
  }, []);

  const validarFormulario = (): boolean => {
    if (!tipoItem.trim()) {
      setErro('O tipo do item é obrigatório.');
      return false;
    }
    if (!pontoDestino.trim()) {
      setErro('Selecione o ponto de destino.');
      return false;
    }
    const qtdNum = Number(quantidade);
    if (!quantidade.trim() || !Number.isInteger(qtdNum) || qtdNum <= 0) {
      setErro('A quantidade deve ser um número inteiro maior que zero.');
      return false;
    }
    setErro('');
    return true;
  };

  const executarSalvamento = async () => {
    if (!validarFormulario()) return;

    setCarregandoSalvar(true);
    try {
      const payload = {
        tipoItem: tipoItem.trim(),
        quantidade: Number(quantidade),
        pontoDestino: pontoDestino.trim(),
      };

      if (modoEdicao && doacaoParaEditar) {
        await atualizarDoacao(doacaoParaEditar.id, payload);
      } else {
        await criarDoacao(payload);
      }

      Keyboard.dismiss();
      navigation.goBack();
    } catch (err) {
      // Em caso de recusa da API (400) ou queda, mantém os dados digitados na tela
      setErro('A API recusou a operação ou está indisponível. Verifique os dados.');
    } finally {
      setCarregandoSalvar(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>O que você quer doar?</Text>
        <View style={styles.chipContainer}>
          {OPCOES_TIPO_DOACAO.map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={[styles.chip, tipoItem === opcao && styles.chipSelecionado]}
              onPress={() => setTipoItem(opcao)}
            >
              <Text style={[styles.chipTexto, tipoItem === opcao && styles.chipTextoSelecionado]}>
                {opcao}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Quantidade (Unidades)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 5"
          placeholderTextColor={tema.cores.textoSuave}
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Para qual ponto de coleta?</Text>
        {carregandoPontos ? (
          <ActivityIndicator size="small" color={tema.cores.primaria} style={{ marginVertical: 12 }} />
        ) : (
          <View style={styles.chipContainer}>
            {pontosDisponiveis.map((ponto) => (
              <TouchableOpacity
                key={ponto.id}
                style={[styles.chip, pontoDestino === ponto.nome && styles.chipSelecionado]}
                onPress={() => setPontoDestino(ponto.nome)}
              >
                <Text style={[styles.chipTexto, pontoDestino === ponto.nome && styles.chipTextoSelecionado]}>
                  {ponto.nome} ({ponto.bairro})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity 
          style={[styles.botaoSalvar, carregandoSalvar && { opacity: 0.7 }]} 
          onPress={executarSalvamento}
          disabled={carregandoSalvar}
        >
          {carregandoSalvar ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.textoBotao}>
              {modoEdicao ? 'Salvar Alterações' : 'Confirmar Doação'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  container: { padding: tema.espacamento.m },
  label: { fontSize: 16, fontWeight: 'bold', color: tema.cores.textoForte, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: tema.cores.cartao, borderWidth: 1, borderColor: tema.cores.borda, borderRadius: tema.bordas.padrao, padding: 12, fontSize: 16, color: tema.cores.textoForte },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: tema.cores.cartao, borderWidth: 1, borderColor: tema.cores.borda },
  chipSelecionado: { backgroundColor: '#E8F6F3', borderColor: tema.cores.sucesso },
  chipTexto: { color: tema.cores.textoForte, fontSize: 14 },
  chipTextoSelecionado: { color: tema.cores.sucesso, fontWeight: 'bold' },
  botaoSalvar: { backgroundColor: tema.cores.sucesso, padding: 16, borderRadius: tema.bordas.padrao, alignItems: 'center', marginTop: 32 },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  erro: { color: '#C62828', marginTop: 12, fontWeight: 'bold', textAlign: 'center' }
});