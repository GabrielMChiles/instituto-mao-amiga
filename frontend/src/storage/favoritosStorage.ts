import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_FAVORITOS = '@mao_amiga:pontos_favoritos';

export async function listarIdsFavoritos(): Promise<string[]> {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_FAVORITOS);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('[FavoritosStorage] Falha ao ler favoritos:', error);
    return [];
  }
}

export async function alternarFavorito(pontoId: string): Promise<string[]> {
  const atuais = await listarIdsFavoritos();
  const existe = atuais.includes(pontoId);
  
  const atualizados = existe 
    ? atuais.filter((id) => id !== pontoId) 
    : [...atuais, pontoId];

  await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(atualizados));
  return atualizados;
}

export async function removerFavorito(pontoId: string): Promise<string[]> {
  const atuais = await listarIdsFavoritos();
  const atualizados = atuais.filter((id) => id !== pontoId);
  await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(atualizados));
  return atualizados;
}