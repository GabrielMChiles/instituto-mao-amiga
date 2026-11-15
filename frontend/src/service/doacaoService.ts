import { Doacao, DoacaoRequest } from '../models/Doacao';
import { Page } from '../models/Ponto';
import { get, post, put, del } from './api';

export function listarDoacoesPaginadas(pagina: number = 0, filtro: string = '', size: number = 10): Promise<Page<Doacao>> {
  const tamanhoValido = Math.min(Math.max(size, 1), 50);
  const filtroCodificado = encodeURIComponent(filtro.trim());
  return get<Page<Doacao>>(`/doacoes/filtro?filtro=${filtroCodificado}&page=${pagina}&size=${tamanhoValido}`);
}

export function getDoacaoPorId(id: string): Promise<Doacao> {
  return get<Doacao>(`/doacoes/${id}`);
}

export function criarDoacao(doacao: DoacaoRequest): Promise<Doacao> {
  return post<Doacao>('/doacoes', doacao);
}

export function atualizarDoacao(id: string, doacao: DoacaoRequest): Promise<Doacao> {
  return put<Doacao>(`/doacoes/${id}`, doacao);
}

export function deletarDoacao(id: string): Promise<void> {
  return del(`/doacoes/${id}`);
}

export function ultimaPaginaDoacoes(pageData: Page<Doacao>): boolean {
  return pageData.page.number + 1 >= pageData.page.totalPages;
}