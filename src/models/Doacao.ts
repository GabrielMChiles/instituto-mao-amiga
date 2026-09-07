export type Doacao = {  
  id: string;
  tipoItem: TipoDoacao;
  quantidade: number;
  pontoDestinoId: string;
  descricao: string; 
}

// contrato fixo do tipo de doacao
export type TipoDoacao = 'ROUPA' | 'ALIMENTO' | 'BRINQUEDO' | 'OUTRO';

export const OPCOES_TIPO_DOACAO: { label: string; value: TipoDoacao }[] = [
  { label: 'Roupas e Vestuário', value: 'ROUPA' },
  { label: 'Cesta Básica / Alimentos', value: 'ALIMENTO' },
  { label: 'Brinquedos', value: 'BRINQUEDO' },
  { label: 'Outros', value: 'OUTRO' },
];