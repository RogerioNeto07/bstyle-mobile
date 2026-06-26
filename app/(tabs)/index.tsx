import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProdutoCard from '../../src/components/ProdutoCard';
import { PRODUTOS_MOCK } from '../../src/services/mockDados';

const CATEGORIAS = ['roupas', 'acessórios', 'plus size'];

export default function HomeScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  const produtosExibidos = PRODUTOS_MOCK.filter(p => {
    if (categoriaSelecionada && p.tipoNome !== categoriaSelecionada) return false;
    if (busca && !p.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>BStyle</Text>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.inputBusca}
            placeholder={categoriaSelecionada ? `categoria: ${categoriaSelecionada}` : "Buscar produto..."}
            value={categoriaSelecionada ? "" : busca}
            onChangeText={setBusca}
            placeholderTextColor="#000"
            editable={!categoriaSelecionada}
          />
          <Ionicons name="search" size={18} color="#000" style={styles.searchIcon} />
        </View>
      </View>

      <View style={styles.subHeader}>
        {categoriaSelecionada ? (
          <View style={styles.statusFiltroContainer}>
            <Text style={styles.textFiltroStatus}>filtrado por categoria: {categoriaSelecionada}</Text>
            <TouchableOpacity 
              onPress={() => {
                setCategoriaSelecionada(null);
                setBusca('');
              }}
              style={styles.botaoLimpar}
            >
              <Ionicons name="close-circle" size={20} color="#ff0055" />
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriasList}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={styles.botaoCategoria}
                onPress={() => setCategoriaSelecionada(cat)}
              >
                <Text style={styles.textoCategoria}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <FlatList
        data={produtosExibidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProdutoCard produto={item} />}
        numColumns={2}
        columnWrapperStyle={styles.rowGrid}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.textVazio}>Nenhum produto encontrado.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#000',
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'InriaSerif-Bold',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginLeft: 16,
    paddingHorizontal: 10,
    height: 38,
  },
  inputBusca: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
    fontWeight: '500',
  },
  searchIcon: {
    marginLeft: 6,
  },
  subHeader: {
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
  },
  categoriasList: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
  },
  botaoCategoria: {
    backgroundColor: '#000',
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCategoria: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'InriaSerif-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  statusFiltroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  textFiltroStatus: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    fontFamily: 'InriaSerif-Regular',
  },
  botaoLimpar: {
    padding: 5,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  rowGrid: {
    justifyContent: 'space-between',
  },
  textVazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontFamily: 'InriaSerif-Regular',
  },
});