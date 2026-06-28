import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRODUTOS_MOCK } from '../../src/services/mockDados';

export default function ProdutoDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const produto = PRODUTOS_MOCK.find(p => p.id.toString() === id);

  if (!produto) {
    return (
      <View style={styles.containerErro}>
        <Text style={styles.textErro}>Produto não encontrado.</Text>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltarHeader}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.logo}>BStyle</Text>
        <View style={styles.placeholderHeader} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image source={{ uri: produto.fotos }} style={styles.imagem} resizeMode="contain" />
          
          <View style={styles.infoPrincipal}>
            <View style={styles.textoIdentificacao}>
              <Text style={styles.nomeProduto}>{produto.nome}</Text>
              
              <TouchableOpacity 
                onPress={() => router.push(`/vendedor/${produto.vendedorNome}`)}
                activeOpacity={0.7}
              >
                <Text style={styles.vendedorProduto}>por: {produto.vendedorNome}</Text>
              </TouchableOpacity>
              
            </View>
            <View style={styles.tagPreco}>
              <Text style={styles.textoPreco}>R$ {produto.preco.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.secaoDetalhes}>
            <Text style={styles.tituloSecao}>Informações:</Text>
            
            <Text style={styles.itemInfo}>Tamanho: <Text style={styles.valorInfo}>M</Text></Text>
            <Text style={styles.itemInfo}>Cor: <Text style={styles.valorInfo}>rosa</Text></Text>
            <Text style={styles.itemInfo}>Descrição: <Text style={styles.valorInfo}>top de academia rosa usado</Text></Text>
          </View>

          <TouchableOpacity style={styles.botaoPedir}>
            <Text style={styles.textoBotaoPedir}>Pedir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  botaoVoltarHeader: {
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
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imagem: {
    width: '100%',
    height: 320,
    marginBottom: 20,
  },
  infoPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 24,
  },
  textoIdentificacao: {
    flex: 1,
    marginRight: 10,
  },
  nomeProduto: {
    fontSize: 28,
    color: '#000',
    fontFamily: 'InriaSerif-Regular',
  },
  vendedorProduto: {
    fontSize: 16,
    color: '#007bff',
    fontFamily: 'InriaSerif-Regular',
    marginTop: 2,
    textDecorationLine: 'underline', // Destaca discretamente que o texto é um link clicável
  },
  tagPreco: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  textoPreco: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secaoDetalhes: {
    width: '100%',
    marginBottom: 30,
  },
  tituloSecao: {
    fontSize: 22,
    color: '#000',
    fontWeight: '500',
    marginBottom: 16,
  },
  itemInfo: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  valorInfo: {
    color: '#555',
  },
  botaoPedir: {
    backgroundColor: '#24E300',
    width: '50%',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textoBotaoPedir: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomBar: {
    height: 50,
    backgroundColor: '#000',
  },
  containerErro: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textErro: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  botaoVoltar: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  textoBotaoVoltar: {
    color: '#fff',
    fontWeight: 'bold',
  },
});