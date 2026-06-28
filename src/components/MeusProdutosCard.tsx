import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProdutoMock } from '../types/produto';

interface Props {
  produto: ProdutoMock;
  onEditar: (id: number) => void;
  onDeletar: (id: number) => void;
}

export default function MeusProdutosCard({ produto, onEditar, onDeletar }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: produto.fotos }} style={styles.image} />
        <View style={styles.tagPreco}>
          <Text style={styles.textoPreco}>R$ {produto.preco.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.titulo} numberOfLines={2}>{produto.nome}</Text>
      </View>

      <View style={styles.acoesContainer}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => onEditar(produto.id)} activeOpacity={0.7}>
          <Text style={styles.textoBotao}>Editar</Text>
          <Ionicons name="create-outline" size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoDeletar} onPress={() => onDeletar(produto.id)} activeOpacity={0.7}>
          <Text style={styles.textoBotao}>Deletar</Text>
          <Ionicons name="trash-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  tagPreco: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff0000',
    paddingVertical: 2,
    alignItems: 'center',
  },
  textoPreco: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  acoesContainer: {
    gap: 8,
    justifyContent: 'center',
    width: 100,
  },
  botaoEditar: {
    backgroundColor: '#000',
    flexDirection: 'row',
    height: 34,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  botaoDeletar: {
    backgroundColor: '#ff0000',
    flexDirection: 'row',
    height: 34,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});