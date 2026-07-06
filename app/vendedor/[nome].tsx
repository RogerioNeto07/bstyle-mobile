import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Linking, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/services/api'; // Certifique-se de que o caminho até o seu axios está correto

export default function PerfilVendedorScreen() {
  const router = useRouter();
  
  // Captura o parâmetro da rota vendedor/[id]
  const { id } = useLocalSearchParams();

  // Estados do componente
  const [vendedor, setVendedor] = useState<any>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // AJUSTE CRUCIAL: Garante que temos um ID válido e limpa caso venha como Array do Expo Router
    const vendedorId = Array.isArray(id) ? id[0] : id;

    if (!vendedorId) {
      setErro("ID do vendedor inválido.");
      setCarregando(false);
      return;
    }

    const buscarDadosVendedor = async () => {
      try {
        setCarregando(true);
        setErro(null);

        // Faz a chamada à nova rota @GetMapping("/{id}") do Spring Boot
        const resposta = await api.get(`/usuarios/${vendedorId}`);
        setVendedor(resposta.data);
      } catch (err: any) {
        console.error("Erro ao buscar dados do vendedor:", err);
        setErro("Não foi possível carregar o perfil deste vendedor.");
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosVendedor();
  }, [id]);

  // Trata o endereço dinâmico vindo do seu UsuarioResponseDTO
  const obterEnderecoFormatado = () => {
    if (!vendedor) return 'Endereço não informado';
    
    const partes = [vendedor.rua, vendedor.numero, vendedor.cidade, vendedor.estado];
    // Filtra strings vazias ou nulas e junta com vírgulas
    const enderecoCompleto = partes.filter(p => p && p.trim() !== '').join(', ');
    
    return enderecoCompleto || `${vendedor.cidade || 'Cidade não informada'} - ${vendedor.estado || ''}`;
  };

  // Trata a foto do perfil usando o IP do seu servidor local backend
  const obterUrlAvatar = () => {
    if (!vendedor || !vendedor.fotoPerfilUrl) {
      return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80';
    }

    const foto = vendedor.fotoPerfilUrl;
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
      if (foto.includes('localhost:8080')) {
        return foto.replace('localhost:8080', '192.168.0.8:8080'); // Substitua pelo IP da sua máquina se necessário
      }
      return foto;
    }
    
    return `http://192.168.0.8:8080/uploads/${foto}`;
  };

  const abrirWhatsapp = () => {
    if (!vendedor || !vendedor.telefone) return;
    const numeroLimpo = vendedor.telefone.replace(/[^\d]/g, '');
    Linking.openURL(`https://wa.me/${numeroLimpo}`);
  };

  const abrirMapa = () => {
    const endereco = obterEnderecoFormatado();
    if (!endereco || endereco === 'Endereço não informado') return;

    const enderecoFormatado = encodeURIComponent(endereco);
    
    const url = Platform.select({
      ios: `maps:0,0?q=${enderecoFormatado}`,
      android: `geo:0,0?q=${enderecoFormatado}`,
      default: `http://googleusercontent.com/maps.google.com/?q=${enderecoFormatado}`
    });

    Linking.openURL(url).catch(() => {
      Linking.openURL(`http://googleusercontent.com/maps.google.com/?q=${enderecoFormatado}`);
    });
  };

  if (carregando) {
    return (
      <View style={styles.containerErro}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={[styles.textErro, { marginTop: 12 }]}>A carregar o perfil...</Text>
      </View>
    );
  }

  if (erro || !vendedor) {
    return (
      <View style={styles.containerErro}>
        <Ionicons name="alert-circle" size={48} color="#ff0055" />
        <Text style={styles.textErro}>{erro || "Vendedor não encontrado."}</Text>
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
          
          <View style={styles.avatarContainer}>
            <Image source={{ uri: obterUrlAvatar() }} style={styles.avatar} />
            {vendedor.telefone && (
              <TouchableOpacity style={styles.botaoTelefone} onPress={abrirWhatsapp} activeOpacity={0.8}>
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.nomeVendedor}>{vendedor.nome}</Text>

          <View style={styles.infoBlock}>
            {/* O seu UsuarioResponseDTO retorna 'login', mapeamos aqui como o E-mail */}
            <Text style={styles.infoTexto}>E-mail: <Text style={styles.infoValor}>{vendedor.login || 'Não informado'}</Text></Text>
            <Text style={styles.infoTexto}>Contato: <Text style={styles.infoValor}>{vendedor.telefone || 'Não informado'}</Text></Text>
            
            <TouchableOpacity 
              style={styles.enderecoContainer} 
              onPress={abrirMapa}
              activeOpacity={0.6}
              disabled={obterEnderecoFormatado() === 'Endereço não informado'}
            >
              <Text style={styles.infoTexto}>Endereço: <Text style={styles.infoValor}>{obterEnderecoFormatado()}</Text></Text>
              <Ionicons name="location" size={24} color="#007bff" style={styles.iconLocation} />
            </TouchableOpacity>
          </View>

          {/* Envia o ID limpo numérico para a rota de avaliações */}
          <TouchableOpacity 
            style={styles.botaoAvaliacoes}
            onPress={() => router.push(`/vendedor/${Array.isArray(id) ? id[0] : id}/avaliacoes`)}
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
    marginTop: 10,
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