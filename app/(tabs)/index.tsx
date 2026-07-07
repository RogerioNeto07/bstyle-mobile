import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProdutoCard from '../../src/components/ProdutoCard';
import api from '../../src/services/api';
import { styles } from '../../src/styles/index.styles';

const CATEGORIAS = ['roupa', 'acessório', 'doações'];

export default function HomeScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await api.get('/produtos'); 
      setProdutos(resposta.data);
    } catch (err: any) {
      console.error(err);
      setErro("Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosExibidos = produtos.filter(p => {
    if (categoriaSelecionada === 'doações') {
      if (p.preco !== 0) return false;
    } else if (categoriaSelecionada) {
      const categoriaProduto = (
        p.tipoNome || 
        p.tipo?.nome || 
        p.categoria?.nome || 
        p.categoriaNome || 
        ''
      ).toLowerCase().trim();

      if (categoriaProduto !== categoriaSelecionada.toLowerCase().trim()) return false;
    }

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
            <Text style={styles.textFiltroStatus}>
              {categoriaSelecionada === 'doações' 
                ? 'filtrado por: Doações' 
                : `filtrado por categoria: ${categoriaSelecionada}`}
            </Text>
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

      {carregando ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.textFeedback}>Carregando produtos...</Text>
        </View>
      ) : erro ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={40} color="red" />
          <Text style={styles.textFeedback}>{erro}</Text>
          <TouchableOpacity style={styles.botaoTentarNovamente} onPress={carregarProdutos}>
            <Text style={styles.textoBotaoTentar}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={produtosExibidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProdutoCard produto={item} />}
          numColumns={2}
          columnWrapperStyle={styles.rowGrid}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          refreshing={carregando}
          onRefresh={carregarProdutos}
          ListEmptyComponent={
            <Text style={styles.textVazio}>Nenhum produto encontrado nesta categoria.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}