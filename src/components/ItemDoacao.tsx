import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Doacao } from '../models/Doacao';
import { tema } from '../themes';

interface Props {
  doacao: Doacao;
  nomePontoDestino: string;
  onPress: () => void;
}

const ItemDoacao = ({ doacao, nomePontoDestino, onPress }: Props) => {
  // 1. NULL POINTER DEFENSE: Evita crash da renderização se a prop vier corrompida
  if (!doacao) {
    return null;
  }

  // 2. OTIMIZAÇÃO E SEGURANÇA: Previne recomputação desnecessária e trata datas inválidas
  const dataFormatada = useMemo(() => {
    if (!doacao.criadoEm) return 'Data não informada';
    
    const data = new Date(doacao.criadoEm);
    // Validação de NaN para datas malformadas
    return isNaN(data.getTime()) 
      ? 'Data inválida' 
      : data.toLocaleDateString('pt-BR');
  }, [doacao.criadoEm]);

  return (
      <TouchableOpacity
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >

      <Text style={styles.tipoItem}>{doacao.tipoItem || 'Item não especificado'}</Text>
      <Text style={styles.detalhe}>Quantidade: {doacao.quantidade ?? 0}</Text>
      <Text style={styles.detalhe}>Descrição: {doacao.descricao || 'Descrição não identificada'}</Text>
      <Text style={styles.detalhe}>Destino: {nomePontoDestino || 'Ponto não identificado'}</Text>
      <Text style={styles.data}>{dataFormatada}</Text>
      </TouchableOpacity>
    
  );
};

// React.memo bloqueia re-renderizações inúteis deste card
export default React.memo(ItemDoacao);

export const styles = StyleSheet.create({
  card: {
    backgroundColor: tema.cores.cartao,
    borderRadius: tema.bordas.padrao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    padding: tema.espacamento.m,
    marginBottom: tema.espacamento.m,
    // Sombreamento sutil sem dependência de containers externos
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tipoItem: {
    fontSize: tema.tipografia.tamanho.subtitulo,
    fontWeight: tema.tipografia.peso.negrito,
    color: tema.cores.textoForte,
    marginBottom: 4,
  },
  detalhe: {
    fontSize: tema.tipografia.tamanho.corpo,
    color: tema.cores.textoForte,
    marginBottom: 2,
  },
  data: {
    fontSize: tema.tipografia.tamanho.pequeno,
    color: tema.cores.textoSuave,
    marginTop: 4,
  },
});