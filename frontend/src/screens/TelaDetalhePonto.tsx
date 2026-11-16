import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { tema } from '../themes';
import { RootStackParamList } from '../navigation/Navigation';
import { Ponto } from '../models/Ponto';
import { deletarPonto, getPontoPorId } from '../service/pontoService';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalhePonto'>;

export default function TelaDetalhePonto({ route, navigation }: Props) {
  const { id } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      async function buscarDetalhes() {
        setCarregando(true);
        setErro(null);
        try {
          const dados = await getPontoPorId(id);
          if (ativo) setPonto(dados);
        } catch (err: any) {
          if (ativo) setErro('Ponto não encontrado (404) ou erro de conexão.');
        } finally {
          if (ativo) setCarregando(false);
        }
      }
      buscarDetalhes();
      return () => { ativo = false; };
    }, [id])
  );

  const confirmarExclusao = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este ponto de coleta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deletarPonto(id);
              Alert.alert('Sucesso', 'Ponto excluído com sucesso.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir o ponto.');
            }
          } 
        }
      ]
    );
  };

  if (carregando) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centralizado]}>
        <ActivityIndicator size="large" color={tema.cores.primaria} />
        <Text style={styles.textoCarregando}>Carregando dados do ponto...</Text>
      </SafeAreaView>
    );
  }

  if (erro || !ponto) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centralizado]}>
        <Ionicons name="alert-circle-outline" size={48} color="#C62828" />
        <Text style={styles.textoErro}>{erro || 'Ponto não encontrado.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.nome}>{ponto.nome}</Text>
          <Text style={styles.label}>Bairro:</Text>
          <Text style={styles.valor}>{ponto.bairro}</Text>

          <Text style={styles.label}>Endereço:</Text>
          <Text style={styles.valor}>{ponto.endereco}</Text>

          <Text style={styles.label}>Horário de Funcionamento:</Text>
          <Text style={styles.valor}>{ponto.horario}</Text>

          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.tipo}>{ponto.tipo}</Text>
        </View>

        <View style={styles.botoesContainer}>
          <TouchableOpacity 
            style={styles.botaoEditar}
            onPress={() => navigation.navigate('TelaFormularioPonto', { pontoParaEditar: ponto })}
          >
            <Ionicons name="create-outline" size={20} color="#FFF" />
            <Text style={styles.textoBotao}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botaoExcluir}
            onPress={confirmarExclusao}
          >
            <Ionicons name="trash-outline" size={20} color="#FFF" />
            <Text style={styles.textoBotao}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  container: { flex: 1, padding: tema.espacamento.m, justifyContent: 'space-between' },
  centralizado: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: {
    backgroundColor: tema.cores.cartao,
    borderRadius: tema.bordas.padrao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    padding: tema.espacamento.g,
    elevation: 2,
  },
  nome: { fontSize: 24, fontWeight: 'bold', color: tema.cores.textoForte, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: tema.cores.textoSuave, marginTop: 12 },
  valor: { fontSize: 16, color: tema.cores.textoForte, marginTop: 2 },
  tipo: { fontSize: 16, fontWeight: 'bold', color: tema.cores.sucesso, marginTop: 2, textTransform: 'uppercase' },
  textoCarregando: { marginTop: 12, color: tema.cores.textoSuave },
  textoErro: { color: '#C62828', fontSize: 16, textAlign: 'center', marginTop: 12 },
  botoesContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  botaoEditar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2980B9',
    minHeight: 48,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  botaoExcluir: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C62828',
    minHeight: 48,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});