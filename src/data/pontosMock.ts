export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  itens: string;
};

// Fonte de dados
export const pontosMock: Ponto[] = [
  { id: '1', nome: 'Ponto Bueno', endereco: 'Rua da Esperança, 123', horario: 'Seg-Sex 08h-18h', itens: 'Roupas e Alimentos' },
  { id: '2', nome: 'Ponto Centro', endereco: 'Av. Solidariedade, 456', horario: 'Sábados 08h-12h', itens: 'Apenas Alimentos' },
  { id: '3', nome: 'Ponto Ferroviário', endereco: 'Praça da Paz, 789', horario: 'Seg-Qua 10h-16h', itens: 'Roupas e Brinquedos' },
  { id: '4', nome: 'Ponto Leste Universitário', endereco: 'Praça da Paz, 789', horario: 'Seg-Qua 10h-16h', itens: 'Roupas e Brinquedos' },
  { id: '5', nome: 'Ponto Vila Nova', endereco: 'Praça da Paz, 789', horario: 'Seg-Qua 10h-16h', itens: 'Roupas e Brinquedos' },
  { id: '6', nome: 'Ponto Marista', endereco: 'Praça da Paz, 789', horario: 'Seg-Qua 10h-16h', itens: 'Roupas e Brinquedos' },
  { id: '7', nome: 'Ponto Parque Amazônia', endereco: 'Praça da Paz, 789', horario: 'Seg-Qua 10h-16h', itens: 'Roupas e Brinquedos' },
  { id: '8', nome: 'Ponto Aeroporto', endereco: 'Praça da Paz, 789', horario: 'Seg-Qua 10h-16h', itens: 'Roupas e Brinquedos' }


];