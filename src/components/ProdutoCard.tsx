import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ProdutoMock } from '../types/produto';

interface Props {
  produto: ProdutoMock;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ProdutoCard({ produto }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/produto/${produto.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: produto.fotos }} style={styles.image} />
        <View style={styles.tagPreco}>
          <Text style={styles.textoPreco}>R$ {produto.preco.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{produto.nome}</Text>
        <Text style={styles.vendedor}>por: {produto.vendedorNome}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tagPreco: {
    position: 'absolute',
    bottom: 8,
    right: 0,
    backgroundColor: '#ff0055',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  textoPreco: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoContainer: {
    backgroundColor: '#000',
    padding: 8,
  },
  titulo: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  vendedor: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
});