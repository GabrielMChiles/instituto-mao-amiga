import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Doacao } from '../models/Doacao';
import { tema } from '../themes';

interface Props {
  doacao: Doacao;
  nomePontoDestino: string;
}

const ItemDoacao = ({ doacao, nomePontoDestino }: Props) => {
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
  
    <View style={styles.card}>
      <Text style={styles.tipo}>{doacao.tipoItem || 'Item não especificado'}</Text>
      <Text style={styles.texto}>Quantidade: {doacao.quantidade ?? 0}</Text>
      <Text style={styles.texto}>Descrição: {doacao.descricao || 'Descrição não identificada'}</Text>
      <Text style={styles.texto}>Destino: {nomePontoDestino || 'Ponto não identificado'}</Text>
      <Text style={styles.data}>{dataFormatada}</Text>
    </View>
  );
};

// React.memo bloqueia re-renderizações inúteis deste card
export default React.memo(ItemDoacao);

export const styles = StyleSheet.create({
  card: {
    backgroundColor: tema.cores.cartao,
    padding: tema.espacamento.m,
    marginBottom: tema.espacamento.m,
    borderRadius: tema.bordas.padrao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    // Sombra sutil para destacar o card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Sombra no Android
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tema.espacamento.p,
  },
  tipo: {
    fontSize: tema.tipografia.tamanho.subtitulo,
    fontWeight: tema.tipografia.peso.negrito,
    color: tema.cores.textoForte,
  },
  texto: {
    fontSize: tema.tipografia.tamanho.corpo,
    color: tema.cores.textoForte,
    marginTop: 4,
  },
  data: {
    fontSize: tema.tipografia.tamanho.pequeno,
    color: tema.cores.textoSuave,
  },
  linhaDetalhe: {
    fontSize: tema.tipografia.tamanho.corpo,
    color: tema.cores.textoForte,
    marginTop: 4,
  }
});