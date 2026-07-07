import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/services/api';

export default function ProdutoDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [produto, setProduto] = useState<any>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const buscarDetalhesProduto = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        const resposta = await api.get(`/produtos/${id}`);
        setProduto(resposta.data);
      } catch (err: any) {
        console.error("Erro ao buscar produto individual:", err);
        setErro("Não foi possível carregar as informações deste produto.");
      } finally {
        setCarregando(false);
      }
    };

    buscarDetalhesProduto();
  }, [id]);

  const obterUrlImagem = () => {
    if (!produto) return 'https://via.placeholder.com/150';
    
    const fotoDoProduto = produto.fotos;

    if (!fotoDoProduto) {
      return 'https://via.placeholder.com/150';
    }

    let nomeArquivo = '';

    if (typeof fotoDoProduto === 'string') {
      nomeArquivo = fotoDoProduto;
    } else if (Array.isArray(fotoDoProduto) && fotoDoProduto.length > 0) {
      const primeira = fotoDoProduto[0];
      nomeArquivo = typeof primeira === 'string' ? primeira : (primeira?.fotoUrl || primeira?.foto_url || '');
    } else if (typeof fotoDoProduto === 'object') {
      nomeArquivo = fotoDoProduto.fotoUrl || fotoDoProduto.foto_url || '';
    }

    if (!nomeArquivo) {
      return 'https://via.placeholder.com/150';
    }

    if (nomeArquivo.startsWith('http://') || nomeArquivo.startsWith('https://')) {
      if (nomeArquivo.includes('localhost:8080')) {
        return nomeArquivo.replace('localhost:8080', '192.168.0.8:8080');
      }
      return nomeArquivo;
    }

    return `http://192.168.0.8:8080/uploads/${nomeArquivo}`;
  };

  if (carregando) {
    return (
      <View style={styles.containerErro}>
        <ActivityIndicator size="large" color="#ff0055" />
        <Text style={[styles.textErro, { marginTop: 12 }]}>Carregando produto...</Text>
      </View>
    );
  }

  if (erro || !produto) {
    return (
      <View style={styles.containerErro}>
        <Text style={styles.textErro}>{erro || "Produto não encontrado."}</Text>
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
          <Image source={{ uri: obterUrlImagem() }} style={styles.imagem} resizeMode="contain" />
          
          <View style={styles.infoPrincipal}>
            <View style={styles.textoIdentificacao}>
              <Text style={styles.nomeProduto}>{produto.nome}</Text>
              
             <TouchableOpacity 
                  onPress={() => {
                    
                    if (produto?.vendedorId) {
                      router.push(`/vendedor/${produto.vendedorId}`);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.vendedorProduto}>
                    por: {produto.vendedorNome || 'BStyle Vendor'}
                  </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tagPreco}>
                <Text style={styles.textoPreco}>
                  {produto.preco === 0 ? 'DOAÇÃO' : `R$ ${produto.preco.toFixed(2)}`}
                </Text>
              </View>
          </View>

          <View style={styles.secaoDetalhes}>
            <Text style={styles.tituloSecao}>Informações:</Text>
            
            <Text style={styles.itemInfo}>
              Descrição:{' '}
              <Text style={styles.valorInfo}>
                {produto.descricao || 'Sem descrição informada para este produto.'}
              </Text>
            </Text>

            <Text style={styles.itemInfo}>
              Cores disponíveis:{' '}
              <Text style={styles.valorInfo}>
                {produto.coresNomes && produto.coresNomes.length > 0 
                  ? produto.coresNomes.join(', ') 
                  : 'Não especificada'}
              </Text>
            </Text>

            <Text style={styles.itemInfo}>
              Tags:{' '}
              <Text style={styles.valorInfo}>
                {produto.tagsNomes && produto.tagsNomes.length > 0 
                  ? produto.tagsNomes.join(', ') 
                  : 'Nenhuma'}
              </Text>
            </Text>
            {produto.tipoNome && (
              <Text style={styles.itemInfo}>
                Categoria: <Text style={styles.valorInfo}>{produto.tipoNome}</Text>
              </Text>
            )}

            <Text style={styles.itemInfo}>
              Quantidade em estoque: <Text style={styles.valorInfo}>{produto.quantidade ?? 0}</Text>
            </Text>

            {produto.vendedorCidade && (
              <Text style={styles.itemInfo}>
                Localização: <Text style={styles.valorInfo}>{produto.vendedorCidade}</Text>
              </Text>
            )}
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
    textDecorationLine: 'underline',
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
    lineHeight: 22,
  },
  valorInfo: {
    color: '#555',
    fontWeight: '400',
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
    textAlign: 'center',
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