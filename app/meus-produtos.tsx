import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRODUTOS_MOCK } from '../src/services/mockDados';
import MeusProdutosCard from '../src/components/MeusProdutosCard';

export default function MeusProdutosScreen() {
  const router = useRouter();
  
  const [meusProdutos, setMeusProdutos] = useState(() => 
    PRODUTOS_MOCK.filter(p => p.vendedorNome.toLowerCase() === 'jaqueline' || p.id <= 4)
  );

  const handleEditar = (id: number) => {
    Alert.alert('Editar', `Navegar para edição do produto ID: ${id}`);
  };

  const handleDeletar = (id: number) => {
    Alert.alert(
      'Deletar Produto',
      'Tem certeza que deseja remover este produto permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar', 
          style: 'destructive',
          onPress: () => {
            setMeusProdutos(prev => prev.filter(p => p.id !== id));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.logo}>BStyle</Text>
        <View style={styles.placeholderHeader} />
      </View>

      <FlatList
        data={meusProdutos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MeusProdutosCard 
            produto={item} 
            onEditar={handleEditar} 
            onDeletar={handleDeletar} 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        
        ListHeaderComponent={
            <TouchableOpacity 
                style={styles.botaoAdicionar}
                onPress={() => router.push('/novo-produto')}
                activeOpacity={0.8}
            >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.textoBotaoAdicionar}>Adicionar Novo Produto</Text>
            </TouchableOpacity>
            }

        ListEmptyComponent={
          <Text style={styles.textVazio}>Você ainda não possui produtos cadastrados.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 100,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  botaoVoltar: {
    padding: 4,
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'InriaSerif-Bold',
  },
  placeholderHeader: {
    width: 32,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  botaoAdicionar: {
    backgroundColor: '#24E300',
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoBotaoAdicionar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textVazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
});