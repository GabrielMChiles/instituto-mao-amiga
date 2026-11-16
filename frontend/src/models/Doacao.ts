export interface Doacao {
  id: string;
  tipoItem: TipoDoacao;
  quantidade: number;
  pontoDestino: string;
  descricao?: string;
  criadoEm: string;
}

export type TipoDoacao = 'ROUPA' | 'ALIMENTO' | 'BRINQUEDO' | 'OUTRO';


export type DoacaoRequest = {
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
};

export const OPCOES_TIPO_DOACAO: { label: string; value: TipoDoacao }[] = [
  { label: 'Roupas e Vestuário', value: 'ROUPA' },
  { label: 'Cesta Básica / Alimentos', value: 'ALIMENTO' },
  { label: 'Brinquedos', value: 'BRINQUEDO' },
  { label: 'Outros', value: 'OUTRO' },
];