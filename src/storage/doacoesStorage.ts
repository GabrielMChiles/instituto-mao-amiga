import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doacao } from '../models/Doacao';

const CHAVE_HISTORICO_DOACOES = '@mao_amiga:historico_doacoes';

/**
 * Busca a lista completa de doações salvas.
 * Retorna um array vazio caso não haja nada ou ocorra uma falha de I/O.
 */
export async function listarDoacoes(): Promise<Doacao[]> {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_HISTORICO_DOACOES);
    if (!dados) return [];
    
    return JSON.parse(dados) as Doacao[];
  } catch (error) {
    console.error('[doacoesStorage] Falha ao listar doações do disco:', error); //
    return [];
  }
}

/**
 * Insere uma nova doação no array existente sem sobrescrever os registros anteriores.
 * A geração de ID e Timestamp ocorre no próprio repositório para garantir consistência.
 */
export async function salvarDoacao(
  novaDoacaoDados: Omit<Doacao, 'id' | 'criadoEm'>
): Promise<Doacao> {
  try {
    const historicoAtual = await listarDoacoes();

    const novaDoacao: Doacao = {
      ...novaDoacaoDados,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // ID único
      criadoEm: new Date().toISOString(), // Data/Hora em ISO 8601 padronizada
    };

    const novoHistorico = [novaDoacao, ...historicoAtual]; // Mais recentes primeiro

    await AsyncStorage.setItem(
      CHAVE_HISTORICO_DOACOES,
      JSON.stringify(novoHistorico)
    );

    return novaDoacao;
  } catch (error) {
    console.error('[doacoesStorage] Erro ao persistir nova doação:', error); //
    throw new Error('Não foi possível salvar a doação no armazenamento local.');
  }
}