import { Doacao } from "../models/Doacao";
import { Ponto } from "../models/Ponto";

export type RootStackParamList = {
  TelaListaPontos: undefined;
  TelaHistoricoDoacoes: undefined;
  TelaFormularioDoacao: { doacaoParaEditar?: Doacao } | undefined;
  TelaDetalheDoacao: { doacao: Doacao };
  TelaDetalhePonto: { id: string };
  TelaFormularioPonto: { pontoParaEditar?: Ponto } | undefined;
};