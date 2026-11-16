import { Doacao } from "../models/Doacao";
import { Ponto } from "../models/Ponto";

export type RootStackParamList = {
  TelaListaPontos: undefined;
  TelaMeusPontos: undefined;
  TelaHistoricoDoacoes: undefined;
  TelaFormularioDoacao: { doacaoParaEditar?: Doacao } | undefined;
  TelaDetalheDoacao: { id: string };
  TelaDetalhePonto: { id: string };
  TelaFormularioPonto: { pontoParaEditar?: Ponto } | undefined;
};