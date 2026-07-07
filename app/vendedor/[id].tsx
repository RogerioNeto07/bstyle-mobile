import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Linking, Platform, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/services/api';

export default function PerfilVendedorScreen() {
  const router = useRouter();
  
  const { id } = useLocalSearchParams();

  const [vendedor, setVendedor] = useState<any>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalDenunciaVisivel, setModalDenunciaVisivel] = useState<boolean>(false);
  const [motivo, setMotivo] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [enviandoDenuncia, setEnviandoDenuncia] = useState<boolean>(false);

  useEffect(() => {
    const vendedorId = Array.isArray(id) ? id[0] : id;

    if (!vendedorId) {
      setErro(`ID do vendedor inválido. Recebido: ${id}`);
      setCarregando(false);
      return;
    }

    const buscarDadosVendedor = async () => {
      try {
        setCarregando(true);
        setErro(null);

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
  const obterInicial = () => {
    if (!vendedor || !vendedor.nome) return '?';
    return vendedor.nome.charAt(0).toUpperCase();
  };

  const obterEnderecoFormatado = () => {
    if (!vendedor) return 'Endereço não informado';
    
    const partes = [vendedor.rua, vendedor.numero, vendedor.cidade, vendedor.estado];
    const enderecoCompleto = partes.filter(p => p && p.trim() !== '').join(', ');
    
    return enderecoCompleto || `${vendedor.cidade || 'Cidade não informada'} - ${vendedor.estado || ''}`;
  };

  const obterUrlAvatar = () => {
    if (!vendedor || !vendedor.fotoPerfilUrl) return null;

    const foto = vendedor.fotoPerfilUrl;
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
      if (foto.includes('localhost:8080')) {
        return foto.replace('localhost:8080', '192.168.0.8:8080');
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

  const lidarComEnvioDenuncia = async () => {
    if (!motivo.trim() || !descricao.trim()) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha o motivo e a descrição da sua denúncia.");
      return;
    }

    const vendedorId = Array.isArray(id) ? id[0] : id;

    try {
      setEnviandoDenuncia(true);

      await api.post('/denuncias', {
        vendedorDenunciadoId: Number(vendedorId),
        motivo: motivo.trim(),
        descricao: descricao.trim()
      });

      Alert.alert("Sucesso", "A sua denúncia foi enviada e será analisada pela administração.");
      
      setMotivo('');
      setDescricao('');
      setModalDenunciaVisivel(false);
    } catch (err: any) {
      console.error("Erro ao enviar denúncia:", err);
      Alert.alert("Erro", "Não foi possível registrar a denúncia. Tente novamente mais tarde.");
    } finally {
      setEnviandoDenuncia(false);
    }
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

  const urlAvatar = obterUrlAvatar();

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
            {urlAvatar ? (
              <Image source={{ uri: urlAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.textoAvatarPlaceholder}>{obterInicial()}</Text>
              </View>
            )}
            
            {vendedor.telefone && (
              <TouchableOpacity style={styles.botaoTelefone} onPress={abrirWhatsapp} activeOpacity={0.8}>
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.nomeVendedor}>{vendedor.nome}</Text>

          <View style={styles.infoBlock}>
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

          <TouchableOpacity 
            style={styles.botaoAvaliacoes}
            onPress={() => router.push(`/vendedor/${Array.isArray(id) ? id[0] : id}/avaliacoes`)}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoAvaliacoes}>Avaliações</Text>
            <Ionicons name="star" size={18} color="#fff" style={styles.iconBotao} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botaoDenunciar} 
            onPress={() => setModalDenunciaVisivel(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoDenunciar}>Denunciar</Text>
            <Ionicons name="warning" size={18} color="#fff" style={styles.iconBotao} />
          </TouchableOpacity>

        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDenunciaVisivel}
        onRequestClose={() => setModalDenunciaVisivel(false)}
      >
        <View style={styles.fundoModal}>
          <View style={styles.conteudoModal}>
            <View style={styles.headerModal}>
              <Text style={styles.tituloModal}>Denunciar Vendedor</Text>
              <TouchableOpacity onPress={() => setModalDenunciaVisivel(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.labelInput}>Motivo da Denúncia</Text>
            <TextInput
              style={styles.inputMotivo}
              placeholder="Ex: Fraude, Produto falso, Ofensas..."
              placeholderTextColor="#999"
              value={motivo}
              onChangeText={setMotivo}
              maxLength={100}
            />

            <Text style={styles.labelInput}>Descrição detalhada</Text>
            <TextInput
              style={styles.inputDescricao}
              placeholder="Descreva detalhadamente o que aconteceu..."
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={setDescricao}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.botoesModalContainer}>
              <TouchableOpacity 
                style={styles.botaoCancelarModal} 
                onPress={() => setModalDenunciaVisivel(false)}
                disabled={enviandoDenuncia}
              >
                <Text style={styles.textoCancelarModal}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.botaoConfirmarModal} 
                onPress={lidarComEnvioDenuncia}
                disabled={enviandoDenuncia}
              >
                {enviandoDenuncia ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.textoConfirmarModal}>Enviar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ff0055',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff0055',
  },
  textoAvatarPlaceholder: {
    color: '#fff',
    fontSize: 62,
    fontWeight: 'bold',
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
  /* ESTILOS ADICIONADOS PARA O MODAL */
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  conteudoModal: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  labelInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  inputMotivo: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    color: '#000',
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  inputDescricao: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 100,
    color: '#000',
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  botoesModalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  botaoCancelarModal: {
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  textoCancelarModal: {
    color: '#333',
    fontWeight: '600',
  },
  botaoConfirmarModal: {
    paddingHorizontal: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#ff0055',
  },
  textoConfirmarModal: {
    color: '#fff',
    fontWeight: 'bold',
  },
});