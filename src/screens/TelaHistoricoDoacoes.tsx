import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/Navigation';
import { listarDoacoes } from '../storage/doacoesStorage';
import { Ponto } from '../models/Ponto';
import { pontosMock } from '../data/pontosMock';
import { Doacao } from '../models/Doacao';
import ItemDoacao from '../components/ItemDoacao';
import { tema } from '../themes';

type TelaHistoricoNavProp = NativeStackNavigationProp<RootStackParamList, 'TelaHistoricoDoacoes'>;

interface ResumoAgrupado {
  tipo: string;
  quantidadeTotal: number;
  qtdDoacoes: number;
}

interface HeaderResumoProps {
  totalGeralDoacoes: number;
  agrupado: ResumoAgrupado[];
  termoBusca: string;
  onChangeBusca: (texto: string) => void;
  onNavegarCadastro: () => void;
}

// 1. ISOLAMENTO DO COMPONENTE FORA DO CORPO DA TELA
// Impede a destruição do nó nativo do TextInput durante as re-renderizações do pai.
const HeaderResumo = React.memo(({ 
  totalGeralDoacoes, 
  agrupado, 
  termoBusca, 
  onChangeBusca, 
  onNavegarCadastro 
}: HeaderResumoProps) => {
  return (
    <View style={styles.headerContainer}>
      {/* CARD DE RESUMO DAS DOAÇÕES */}
      <View style={styles.cardResumo}>
        <Text style={styles.tituloCardResumo}>Resumo das doações</Text>
        
        <View style={styles.containerTotalGeral}>
          <Text style={styles.numeroTotalGeral}>{totalGeralDoacoes}</Text>
          <Text style={styles.legendaTotalGeral}>
            {totalGeralDoacoes === 1 ? 'doação registrada' : 'doações registradas'}
          </Text>
        </View>

        <View style={styles.divisorResumo} />

        {totalGeralDoacoes === 0 ? (
          <Text style={styles.textoResumoVazio}>Nenhuma doação registrada ainda.</Text>
        ) : (
          <View style={styles.listaTiposResumo}>
            {agrupado.map((item, index) => {
              const pluralUnidade = item.quantidadeTotal === 1 ? 'unidade' : 'unidades';
              const pluralDoacao = item.qtdDoacoes === 1 ? 'doação' : 'doações';

              return (
                <React.Fragment key={item.tipo}>
                  <View style={styles.itemTipoResumo}>
                    <Text style={styles.nomeTipoResumo}>{item.tipo}</Text>
                    <Text style={styles.detalheTipoResumo}>
                      {item.quantidadeTotal.toLocaleString('pt-BR')} {pluralUnidade} · {item.qtdDoacoes} {pluralDoacao}
                    </Text>
                  </View>

                  {index < agrupado.length - 1 && <View style={styles.separadorSutilItem} />}
                </React.Fragment>
              );
            })}
          </View>
        )}
      </View>

      {/* LINHA DE BUSCA + BOTÃO DE CADASTRO */}
      <View style={styles.linhaBuscaECadastro}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por tipo de item..."
          placeholderTextColor={tema.cores.textoSuave}
          value={termoBusca}
          onChangeText={onChangeBusca}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        <TouchableOpacity 
          style={styles.botaoAdicionarQuadrado} 
          onPress={onNavegarCadastro}
          activeOpacity={0.8}
          accessibilityLabel="Cadastrar nova doação"
        >
          <Text style={styles.textoBotaoAdicionar}>+</Text>
        </TouchableOpacity>
      </View>

      {/* IDENTIFICAÇÃO DE SEÇÃO */}
      <Text style={styles.tituloSecao}>DOAÇÕES REGISTRADAS</Text>
    </View>
  );
});

export default function TelaHistoricoDoacoes() {
  const navigation = useNavigation<TelaHistoricoNavProp>();
  
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [mapaPontos, setMapaPontos] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');

  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;

      async function carregarDados() {
        setCarregando(true);
        try {
          const historico = await listarDoacoes();
          if (!telaAtiva) return;

          const dicionario: Record<string, string> = {};
          pontosMock.forEach((ponto: Ponto) => {
            dicionario[ponto.id] = ponto.nome;
          });

          setMapaPontos(dicionario);
          setDoacoes(historico);
        } catch (error) {
          console.error('[TelaHistorico] Erro ao carregar doações do disco:', error);
        } finally {
          if (telaAtiva) setCarregando(false);
        }
      }

      carregarDados();
      return () => { telaAtiva = false; };
    }, [])
  );

  // CÁLCULO DO RESUMO GLOBAL (Derivado)
  const resumoGlobal = useMemo(() => {
    const totalGeralDoacoes = doacoes.length;

    if (totalGeralDoacoes === 0) {
      return { totalGeralDoacoes: 0, agrupado: [] };
    }

    const mapaAgrupamento = new Map<string, { quantidadeTotal: number; qtdDoacoes: number }>();

    doacoes.forEach((item) => {
      const tipo = item.tipoItem ? item.tipoItem.toUpperCase() : 'OUTROS';
      const qtd = Number(item.quantidade) || 0;
      const atual = mapaAgrupamento.get(tipo) || { quantidadeTotal: 0, qtdDoacoes: 0 };

      mapaAgrupamento.set(tipo, {
        quantidadeTotal: atual.quantidadeTotal + qtd,
        qtdDoacoes: atual.qtdDoacoes + 1,
      });
    });

    const agrupado: ResumoAgrupado[] = Array.from(mapaAgrupamento.entries())
      .map(([tipo, dados]) => ({
        tipo,
        quantidadeTotal: dados.quantidadeTotal,
        qtdDoacoes: dados.qtdDoacoes,
      }))
      .sort((a, b) => b.quantidadeTotal - a.quantidadeTotal);

    return { totalGeralDoacoes, agrupado };
  }, [doacoes]);

  // FILTRAGEM DA LISTA (Derivada)
  const doacoesFiltradas = useMemo(() => {
    if (!termoBusca.trim()) return doacoes;

    const termoNormalizado = termoBusca.toLowerCase().trim();
    return doacoes.filter((doacao) => 
      doacao.tipoItem?.toLowerCase().includes(termoNormalizado)
    );
  }, [doacoes, termoBusca]);

  const handleNavegarCadastro = useCallback(() => {
    navigation.navigate('TelaFormularioDoacao');
  }, [navigation]);

  if (carregando) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color={tema.cores.primaria} />
        <Text style={styles.textoCarregando}>Acessando banco de dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={doacoesFiltradas}
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          
          // CABEÇALHO ESTÁVEL: Renderiza como nó JSX mantendo a identidade dos filhos
          ListHeaderComponent={
            <HeaderResumo
              totalGeralDoacoes={resumoGlobal.totalGeralDoacoes}
              agrupado={resumoGlobal.agrupado}
              termoBusca={termoBusca}
              onChangeBusca={setTermoBusca}
              onNavegarCadastro={handleNavegarCadastro}
            />
          }
          renderItem={({ item }) => (
            <ItemDoacao 
              doacao={item} 
              nomePontoDestino={mapaPontos[item.pontoDestinoId] || 'Ponto Desconhecido'} 
              onPress={() => navigation.navigate('TelaDetalheDoacao', { doacao: item })}
            />
          )}
          
          // 2. CORREÇÃO DE ESTILO: O paddingHorizontal NUNCA é removido, mesmo com a lista vazia
          contentContainerStyle={[
            styles.containerListaBase,
            doacoesFiltradas.length === 0 && styles.containerListaVazia
          ]}
          
          ListEmptyComponent={
            <View style={styles.listaVazia}>
              <Text style={styles.textoVazio}>
                {termoBusca.trim() 
                  ? `Nenhuma doação encontrada para "${termoBusca}".` 
                  : 'Nenhum registro exibido no momento.'}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  container: { flex: 1, backgroundColor: tema.cores.fundo },
  centralizado: { justifyContent: 'center', alignItems: 'center' },
  textoCarregando: { marginTop: 8, color: tema.cores.textoSuave },

  headerContainer: {
    paddingTop: tema.espacamento.m,
  },

  // CARD DE RESUMO
  cardResumo: {
    backgroundColor: tema.cores.cartao,
    borderRadius: tema.bordas.padrao,
    borderColor: tema.cores.borda,
    borderWidth: 1,
    padding: tema.espacamento.m,
    marginBottom: tema.espacamento.m,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tituloCardResumo: {
    fontSize: tema.tipografia.tamanho.pequeno,
    fontWeight: tema.tipografia.peso.negrito,
    color: tema.cores.textoSuave,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  containerTotalGeral: { marginVertical: 4 },
  numeroTotalGeral: {
    fontSize: 28,
    fontWeight: tema.tipografia.peso.negrito,
    color: tema.cores.primaria,
    lineHeight: 32,
  },
  legendaTotalGeral: {
    fontSize: tema.tipografia.tamanho.corpo,
    color: tema.cores.textoForte,
  },
  divisorResumo: {
    height: 1,
    backgroundColor: tema.cores.borda,
    marginVertical: tema.espacamento.p,
  },
  textoResumoVazio: {
    fontSize: tema.tipografia.tamanho.pequeno,
    color: tema.cores.textoSuave,
    fontStyle: 'italic',
  },
  listaTiposResumo: { gap: 4 },
  itemTipoResumo: { paddingVertical: 2 },
  nomeTipoResumo: {
    fontSize: tema.tipografia.tamanho.corpo,
    fontWeight: tema.tipografia.peso.negrito,
    color: tema.cores.textoForte,
  },
  detalheTipoResumo: {
    fontSize: tema.tipografia.tamanho.pequeno,
    color: tema.cores.textoSuave,
    marginTop: 2,
  },
  separadorSutilItem: {
    height: 1,
    backgroundColor: tema.cores.borda,
    opacity: 0.5,
    marginVertical: 4,
  },

  // LINHA DE BUSCA + BOTÃO CADASTRO
  linhaBuscaECadastro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espacamento.p,
    marginBottom: tema.espacamento.m,
  },
  inputBusca: {
    flex: 1,
    height: tema.acessibilidade.alvoMinimo,
    backgroundColor: tema.cores.cartao,
    borderWidth: 1,
    borderColor: tema.cores.borda,
    borderRadius: tema.bordas.padrao,
    paddingHorizontal: tema.espacamento.m,
    fontSize: tema.tipografia.tamanho.corpo,
    color: tema.cores.textoForte,
  },
  botaoAdicionarQuadrado: {
    width: tema.acessibilidade.alvoMinimo,
    height: tema.acessibilidade.alvoMinimo,
    backgroundColor: tema.cores.sucesso,
    borderRadius: tema.bordas.padrao,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoAdicionar: {
    color: tema.cores.cartao,
    fontSize: 24,
    fontWeight: tema.tipografia.peso.negrito,
    lineHeight: 26,
  },

  // SEÇÃO
  tituloSecao: {
    fontSize: tema.tipografia.tamanho.pequeno,
    fontWeight: tema.tipografia.peso.negrito,
    color: tema.cores.textoSuave,
    letterSpacing: 0.8,
    marginBottom: tema.espacamento.p,
  },

  // 3. ESTILOS DE CONTAINER DA LISTA CORRIGIDOS
  containerListaBase: {
    paddingHorizontal: tema.espacamento.m, // Garantido para TODOS os estados da lista!
    paddingBottom: tema.espacamento.g,
  },
  containerListaVazia: {
    flexGrow: 1, // Expande para permitir centralização do estado vazio sem remover o paddingHorizontal
  },
  listaVazia: { 
    paddingVertical: tema.espacamento.xg, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  textoVazio: { 
    fontSize: tema.tipografia.tamanho.corpo, 
    color: tema.cores.textoSuave, 
    textAlign: 'center' 
  },
});