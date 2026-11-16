import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Keyboard, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { tema } from '../themes';
import { RootStackParamList } from '../navigation/Navigation';
import { TipoPonto } from '../models/Ponto';
import { atualizarPonto, criarPonto } from '../service/pontoService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaFormularioPonto'>;

const OPCOES_TIPO: { label: string; value: TipoPonto }[] = [
  { label: 'Coleta', value: 'COLETA' },
  { label: 'Distribuição', value: 'DISTRIBUICAO' },
];

export default function TelaFormularioPonto({ route, navigation }: Props) {
  const pontoParaEditar = route.params?.pontoParaEditar;
  const modoEdicao = Boolean(pontoParaEditar);

  const scrollViewRef = useRef<ScrollView>(null);

  const [nome, setNome] = useState(pontoParaEditar?.nome || '');
  const [endereco, setEndereco] = useState(pontoParaEditar?.endereco || '');
  const [bairro, setBairro] = useState(pontoParaEditar?.bairro || '');
  const [horario, setHorario] = useState(pontoParaEditar?.horario || '');
  const [tipo, setTipo] = useState<TipoPonto>(pontoParaEditar?.tipo || 'COLETA');
  
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: modoEdicao ? 'Editar Ponto de Coleta' : 'Cadastrar Ponto de Coleta',
    });
  }, [navigation, modoEdicao]);

  const validarFormulario = (): boolean => {
    if (!nome.trim() || !endereco.trim() || !bairro.trim() || !horario.trim() || !tipo) {
      setErro('Todos os campos são obrigatórios e não podem estar vazios.');
      return false;
    }
    setErro(null);
    return true;
  };

  const executarSalvamento = async () => {
    if (!validarFormulario()) return;

    setCarregando(true);
    setErro(null);

    try {
      const payload = { nome: nome.trim(), endereco: endereco.trim(), bairro: bairro.trim(), horario: horario.trim(), tipo };

      if (modoEdicao && pontoParaEditar) {
        await atualizarPonto(pontoParaEditar.id, payload);
        Alert.alert('Sucesso', 'Ponto atualizado com sucesso!');
      } else {
        await criarPonto(payload);
        Alert.alert('Sucesso', 'Ponto cadastrado com sucesso!');
      }

      Keyboard.dismiss();
      navigation.goBack();
    } catch (err: any) {
      // Mantém o que foi digitado em caso de erro da API (400 ou falha de conexão)
      setErro('A API recusou a operação ou está indisponível. Verifique os dados e tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleFocusInput = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Nome do Ponto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Paróquia São José"
            placeholderTextColor={tema.cores.textoSuave}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Rua 10, Quadra 5"
            placeholderTextColor={tema.cores.textoSuave}
            value={endereco}
            onChangeText={setEndereco}
          />

          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Setor Bueno"
            placeholderTextColor={tema.cores.textoSuave}
            value={bairro}
            onChangeText={setBairro}
          />

          <Text style={styles.label}>Horário de Funcionamento</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Seg a Sex, 8h às 18h"
            placeholderTextColor={tema.cores.textoSuave}
            value={horario}
            onChangeText={setHorario}
            onFocus={handleFocusInput}
          />

          <Text style={styles.label}>Tipo de Ponto</Text>
          <View style={styles.chipContainer}>
            {OPCOES_TIPO.map((opcao) => (
              <TouchableOpacity
                key={opcao.value}
                style={[styles.chip, tipo === opcao.value && styles.chipSelecionado]}
                onPress={() => setTipo(opcao.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipTexto, tipo === opcao.value && styles.chipTextoSelecionado]}>
                  {opcao.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {erro && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity 
            style={[styles.botaoSalvar, carregando && { opacity: 0.7 }]} 
            onPress={executarSalvamento}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name={modoEdicao ? "checkmark-circle-outline" : "save-outline"} size={22} color="#FFF" />
                <Text style={styles.textoBotao}>{modoEdicao ? 'Salvar Alterações' : 'Cadastrar Ponto'}</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  keyboardContainer: { flex: 1 },
  container: { padding: tema.espacamento.m, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: 'bold', color: tema.cores.textoForte, marginBottom: 8, marginTop: 16 },
  input: { 
    backgroundColor: tema.cores.cartao, 
    borderWidth: 1, 
    borderColor: tema.cores.borda, 
    borderRadius: tema.bordas.padrao, 
    paddingHorizontal: 12, 
    minHeight: 48, 
    fontSize: 16,
    color: tema.cores.textoForte
  },
  chipContainer: { flexDirection: 'row', gap: 12 },
  chip: { 
    flex: 1,
    minHeight: 48,
    paddingVertical: 10, 
    borderRadius: tema.bordas.padrao, 
    backgroundColor: tema.cores.cartao, 
    borderWidth: 1, 
    borderColor: tema.cores.borda,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chipSelecionado: { backgroundColor: '#E8F6F3', borderColor: tema.cores.sucesso },
  chipTexto: { color: tema.cores.textoSuave, fontSize: 16, fontWeight: 'bold' },
  chipTextoSelecionado: { color: tema.cores.sucesso },
  botaoSalvar: { 
    flexDirection: 'row',
    backgroundColor: tema.cores.sucesso, 
    minHeight: 52,
    borderRadius: tema.bordas.padrao, 
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 32,
    gap: 8
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  erro: { color: '#C62828', marginTop: 12, fontWeight: 'bold', textAlign: 'center' }
});