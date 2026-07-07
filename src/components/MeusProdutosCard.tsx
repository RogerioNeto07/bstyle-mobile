import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/meusprodutoscard.styles';

interface Props {
  produto: any;
  onEditar: (produto: any) => void;
  onDeletar: (id: number) => void;
}

export default function MeusProdutosCard({ produto, onEditar, onDeletar }: Props) {
  
  const obterUrlImagem = () => {
    if (!produto) return 'https://via.placeholder.com/150';
    const fotoDoProduto = produto.fotos;
    if (!fotoDoProduto) return 'https://via.placeholder.com/150';

    let nomeArquivo = '';
    if (typeof fotoDoProduto === 'string') {
      nomeArquivo = fotoDoProduto;
    } else if (Array.isArray(fotoDoProduto) && fotoDoProduto.length > 0) {
      const primeira = fotoDoProduto[0];
      nomeArquivo = typeof primeira === 'string' ? primeira : (primeira?.fotoUrl || primeira?.foto_url || '');
    } else if (typeof fotoDoProduto === 'object') {
      nomeArquivo = fotoDoProduto.fotoUrl || fotoDoProduto.foto_url || '';
    }

    if (!nomeArquivo) return 'https://via.placeholder.com/150';

    if (nomeArquivo.startsWith('http://') || nomeArquivo.startsWith('https://')) {
      if (nomeArquivo.includes('localhost:8080')) {
        return nomeArquivo.replace('localhost:8080', '192.168.0.8:8080');
      }
      return nomeArquivo;
    }

    return `http://192.168.0.8:8080/uploads/${nomeArquivo}`;
  };

  const renderPreco = () => {
    const valor = produto.preco;
    if (valor === 0 || valor === '0' || valor === 'DOAÇÃO' || valor === undefined) {
      return 'DOAÇÃO';
    }
    
    const valorNumerico = typeof valor === 'number' ? valor : parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico === 0) {
      return 'DOAÇÃO';
    }

    return `R$ ${valorNumerico.toFixed(2)}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: obterUrlImagem() }} style={styles.image} />
        <View style={styles.tagPreco}>
          <Text style={styles.textoPreco}>{renderPreco()}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.titulo} numberOfLines={2}>{produto.nome}</Text>
      </View>

      {}
      <View style={styles.acoesContainer}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => onEditar(produto)} activeOpacity={0.7}>
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