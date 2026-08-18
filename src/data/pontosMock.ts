export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  itens: string;
};

// Fonte de dados
export const pontosMock: Ponto[] = [
  { id: '1', nome: 'Ponto Centro', endereco: 'Rua da Esperança, 123', horario: 'Seg-Sex 08h-18h', itens: 'Roupas e Alimentos' },
  { id: '2', nome: 'Ponto Sul', endereco: 'Av. Solidariedade, 456', horario: 'Sábados 08h-12h', itens: 'Apenas Alimentos' },
  { id: '3', nome: 'Ponto Norte', endereco: 'Praça da Paz, 789', horario: 'Seg-Qua 10h-16h', itens: 'Roupas e Brinquedos' }
];