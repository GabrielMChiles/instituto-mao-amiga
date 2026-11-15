import { Doacao } from "../models/Doacao";

export type RootStackParamList = {
  TelaListaPontos: undefined;
  TelaHistoricoDoacoes: undefined;
  TelaFormularioDoacao: { doacaoParaEditar?: Doacao } | undefined;
  TelaDetalheDoacao: { doacao: Doacao };
  TelaDetalhePonto: { id: string };
};