import { Page, Ponto } from '../models/Ponto';
import { get, post, put, del } from './api';

export function listarPontosPaginados(pagina: number = 0, filtro: string = '', size: number = 10): Promise<Page<Ponto>> {
  const tamanhoValido = Math.min(Math.max(size, 1), 50);
  const filtroCodificado = encodeURIComponent(filtro.trim());
  return get<Page<Ponto>>(`/pontos/filtro?filtro=${filtroCodificado}&page=${pagina}&size=${tamanhoValido}`);
}

export function getPontoPorId(id: string): Promise<Ponto> {
  return get<Ponto>(`/pontos/${id}`);
}

export function criarPonto(ponto: Omit<Ponto, 'id'>): Promise<Ponto> {
  return post<Ponto>('/pontos', ponto);
}

export function atualizarPonto(id: string, ponto: Omit<Ponto, 'id'>): Promise<Ponto> {
  return put<Ponto>(`/pontos/${id}`, ponto);
}

export function deletarPonto(id: string): Promise<void> {
  return del(`/pontos/${id}`);
}

export function ultimaPagina(pageData: Page<Ponto>): boolean {
  return pageData.page.number + 1 >= pageData.page.totalPages;
}