import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

// 1. O Contrato de Dados (Tipagem Estática)
type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  itens: string;
};

// 2. O Banco de Dados Falso (Single Source of Truth Temporária)
const pontosMock: Ponto[] = [
  { id: '1', nome: 'Ponto Centro', endereco: 'Rua da Esperança, 123', horario: 'Seg-Sex 08h-18h', itens: 'Roupas e Alimentos' },
  { id: '2', nome: 'Ponto Sul', endereco: 'Av. Solidariedade, 456', horario: 'Sábados 08h-12h', itens: 'Apenas Alimentos' },
  { id: '3', nome: 'Ponto Norte', endereco: 'Praça da Paz, 789', horario: 'Seg-Qua 10h-16h', itens: 'Roupas e Brinquedos' }
];

// 3. O Componente de Detalhe (Isolado e com Props - Somente Leitura)
function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{ponto.nome}</Text>
      <Text style={styles.texto}>📍 {ponto.endereco}</Text>
      <Text style={styles.texto}>🕒 {ponto.horario}</Text>
      <Text style={styles.texto}>📦 Recebe/Distribui: {ponto.itens}</Text>
    </View>
  );
}

// 4. O Componente Principal (Ponto de Entrada da Tela)
export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.headerTitle}>Instituto Mão Amiga</Text>

        {/* Renderização da Lista Dinâmica */}
        {pontosMock.map((ponto) => (
          <DetalhePonto key={ponto.id} ponto={ponto} />
        ))}
        
      </ScrollView>
    </SafeAreaView>
  );
}

// 5. Estilos (Design System Local)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 24,
    marginTop: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // Elevação para Android/iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 12,
  },
  texto: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 6,
    fontWeight: '500',
  }
});