import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilTabScreen() {
  const router = useRouter();

  const dadosUsuario = {
    nome: 'Andreia Nunes',
    email: 'andreia.n@gmail.com',
    contato: '(84) 98888-8888',
    endereco: 'Rua São Miguel Nº 2079',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>BStyle</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          
          <Image source={{ uri: dadosUsuario.fotoUrl }} style={styles.avatar} />

          <View style={styles.nomeContainer}>
            <Text style={styles.nomeUsuario}>{dadosUsuario.nome}</Text>
            <TouchableOpacity style={styles.botaoEdit}>
              <Ionicons name="create-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoTexto}>E-mail: <Text style={styles.infoValor}>{dadosUsuario.email}</Text></Text>
            <Text style={styles.infoTexto}>Contato: <Text style={styles.infoValor}>{dadosUsuario.contato}</Text></Text>
            <Text style={styles.infoTexto}>Endereço: <Text style={styles.infoValor}>{dadosUsuario.endereco}</Text></Text>
          </View>

          <TouchableOpacity 
            style={styles.botaoMeusProdutos}
            onPress={() => router.push('/meus-produtos')}
          >
            <Text style={styles.textoBotaoProdutos}>Meus Produtos</Text>
            <Ionicons name="bag-handle-outline" size={20} color="#fff" style={styles.iconBotao} />
          </TouchableOpacity>

        </View>

        <TouchableOpacity 
          style={styles.botaoSair} 
          onPress={() => router.replace('/auth/login')}
        >
          <Text style={styles.textoBotaoSair}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  logo: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'InriaSerif-Bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 15,
    padding: 30,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    gap: 8,
  },
  nomeUsuario: {
    fontSize: 28,
    fontFamily: 'InriaSerif-Regular',
    color: '#000',
  },
  botaoEdit: {
    padding: 4,
  },
  infoBlock: {
    width: '100%',
    marginBottom: 35,
    gap: 12,
  },
  infoTexto: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  infoValor: {
    fontWeight: 'normal',
    color: '#333',
  },
  botaoMeusProdutos: {
    backgroundColor: '#000',
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textoBotaoProdutos: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  iconBotao: {
    marginLeft: 10,
  },
  botaoSair: {
    marginTop: 30,
    padding: 10,
  },
  textoBotaoSair: {
    color: '#ff0055',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});