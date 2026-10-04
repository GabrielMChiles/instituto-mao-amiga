export const tema = {
  cores: {
    primaria: '#1B3A5C', // Azul principal do Instituto
    secundaria: '#2196F3',
    sucesso: '#4CAF50',
    perigo: '#C62828', // Para botões de excluir/erros
    aviso: '#e1e42b', // Para botões de excluir/erros
    fundo: '#F5F7FA', // Cinza muito claro para fundo de telas
    cartao: '#FFFFFF', // Fundo de cards
    textoForte: '#111827',
    textoSuave: '#6B7280',
    borda: '#E5E7EB',
  },
  espacamento: {
    p: 8,
    m: 16,
    g: 24,
    xg: 32,
  },
  bordas: {
    padrao: 8,
    arredondada: 16,
  },
  tipografia: {
    tamanho: {
      pequeno: 12,
      corpo: 14,
      subtitulo: 16,
      titulo: 20,
    },
    peso: {
      normal: '400' as const,
      negrito: 'bold' as const,
    }
  },
  // Regra de acessibilidade mobile: Alvo mínimo de toque
  acessibilidade: {
    alvoMinimo: 50,
  }
};