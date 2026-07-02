import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Avaliacao {
  id: string;
  usuarioNome: string;
  comentario: string;
  produtoFoto: string;
}

export default function AvaliacoesScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([
    {
      id: '1',
      usuarioNome: 'Andreia Nunes',
      comentario: 'Produto em ótimo estado, vendedora simpática e prestativa!',
      produtoFoto: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      usuarioNome: 'Andreia Nunes',
      comentario: 'Produto em ótimo estado, vendedora simpática e prestativa!',
      produtoFoto: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      usuarioNome: 'Andreia Nunes',
      comentario: 'Produto em ótimo estado, vendedora simpática e prestativa!',
      produtoFoto: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '4',
      usuarioNome: 'Andreia Nunes',
      comentario: 'Produto em ótimo estado, vendedora simpática e prestativa!',
      produtoFoto: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&auto=format&fit=crop&q=80',
    },
  ]);

  const handleDenunciar = (id: string) => {
    Alert.alert(
      'Denunciar Avaliação',
      'Deseja sinalizar este comentário como impróprio para a moderação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Denunciar', 
          style: 'destructive',
          onPress: () => Alert.alert('Sucesso', 'Agradecemos o envio. A avaliação será revisada.')
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
        data={avaliacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        
        ListHeaderComponent={
          <Text style={styles.tituloTela}>
            Avaliações de{'\n'}{nome === 'jaqueline' ? 'Jaqueline Mota' : nome}
          </Text>
        }
        
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.produtoFoto }} style={styles.imagemProduto} />

            <View style={styles.infoContainer}>
              <Text style={styles.nomeUsuario}>{item.usuarioNome}</Text>
              <Text style={styles.comentarioText}>{item.comentario}</Text>
            </View>

            <TouchableOpacity 
              style={styles.botaoDenunciar} 
              onPress={() => handleDenunciar(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.textoBotaoDenunciar}>Denunciar</Text>
              <Ionicons name="warning-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
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
  tituloTela: {
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 24,
    lineHeight: 38,
    fontFamily: 'InriaSerif-Regular', 
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imagemProduto: {
    width: 80,
    height: 80,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  nomeUsuario: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 4,
  },
  comentarioText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  botaoDenunciar: {
    backgroundColor: '#ff0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 100,
  },
  textoBotaoDenunciar: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});