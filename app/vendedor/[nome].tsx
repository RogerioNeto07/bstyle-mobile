import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilVendedorScreen() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();

  const dadosVendedor = {
    nomeCompleto: nome === 'jaqueline' ? 'Jaqueline Mota' : `${nome}`,
    email: 'jaqueline.m@gmail.com',
    contato: '+55 (84) 99999-9999',
    endereco: 'Pau dos Ferros - Avenida Getúlio Vargas 1323',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  };

  const abrirWhatsapp = () => {
    const numeroLimpo = dadosVendedor.contato.replace(/[^\d]/g, '');
    Linking.openURL(`https://wa.me/${numeroLimpo}`);
  };

  const abrirMapa = () => {
    const enderecoFormatado = encodeURIComponent(dadosVendedor.endereco);
    
    const url = Platform.select({
      ios: `maps:0,0?q=${enderecoFormatado}`,
      android: `geo:0,0?q=${enderecoFormatado}`,
      default: `https://www.google.com/maps/search/?api=1&query=${enderecoFormatado}`
    });

    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${enderecoFormatado}`);
    });
  };

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
          
          <View style={styles.avatarContainer}>
            <Image source={{ uri: dadosVendedor.fotoUrl }} style={styles.avatar} />
            <TouchableOpacity style={styles.botaoTelefone} onPress={abrirWhatsapp} activeOpacity={0.8}>
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.nomeVendedor}>{dadosVendedor.nomeCompleto}</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.infoTexto}>E-mail: <Text style={styles.infoValor}>{dadosVendedor.email}</Text></Text>
            <Text style={styles.infoTexto}>Contato: <Text style={styles.infoValor}>{dadosVendedor.contato}</Text></Text>
            
            <TouchableOpacity 
              style={styles.enderecoContainer} 
              onPress={abrirMapa}
              activeOpacity={0.6}
            >
              <Text style={styles.infoTexto}>Endereço: <Text style={styles.infoValor}>{dadosVendedor.endereco}</Text></Text>
              <Ionicons name="location" size={24} color="#007bff" style={styles.iconLocation} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.botaoAvaliacoes}
            onPress={() => router.push(`/vendedor/${nome}/avaliacoes`)}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoAvaliacoes}>Avaliações</Text>
            <Ionicons name="star" size={18} color="#fff" style={styles.iconBotao} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoDenunciar}>
            <Text style={styles.textoBotaoDenunciar}>Denunciar</Text>
            <Ionicons name="warning" size={18} color="#fff" style={styles.iconBotao} />
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
    paddingVertical: 30,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botaoTelefone: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#24E300',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  nomeVendedor: {
    fontSize: 26,
    fontWeight: '500',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoBlock: {
    width: '100%',
    marginBottom: 30,
    gap: 12,
  },
  infoTexto: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
  },
  infoValor: {
    color: '#444',
    fontWeight: 'normal',
  },
  enderecoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 6,
  },
  iconLocation: {
    marginLeft: 10,
  },
  botaoAvaliacoes: {
    backgroundColor: '#FFC107',
    flexDirection: 'row',
    width: '65%',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBotaoAvaliacoes: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoDenunciar: {
    backgroundColor: '#C4C4C4',
    flexDirection: 'row',
    width: '65%',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoDenunciar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconBotao: {
    marginLeft: 8,
  },
  bottomBar: {
    height: 50,
    backgroundColor: '#000',
  },
});