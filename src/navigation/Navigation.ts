import { Doacao } from "../models/Doacao";

export type RootStackParamList = {
  TelaHistoricoDoacoes: undefined;
  TelaFormularioDoacao: { doacaoParaEditar?: Doacao } | undefined;
  TelaDetalheDoacao: { doacao: Doacao };
};