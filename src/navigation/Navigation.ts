import { Doacao } from "../models/Doacao";

export type RootStackParamList = {
  TelaHistoricoDoacoes: undefined;
  TelaFormularioDoacao: undefined;
  TelaDetalheDoacao: { doacao: Doacao };
};