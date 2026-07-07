import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../src/services/api';
import { styles } from '../../src/styles/perfil.styles';

export default function PerfilTabScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [modalVisivel, setModalVisivel] = useState<boolean>(false);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');

  const carregarPerfil = async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/usuarios/perfil');
      setUsuario(resposta.data);
    } catch (erro) {
      console.error(erro);
      const cache = await AsyncStorage.getItem('@BStyle:usuario');
      if (cache) {
        setUsuario(JSON.parse(cache));
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const abrirEdicao = () => {
    if (usuario) {
      setNome(usuario.nome || '');
      setTelefone(usuario.telefone || '');
      setCidade(usuario.cidade || '');
      setEstado(usuario.estado || '');
      setRua(usuario.rua || '');
      setNumero(usuario.numero || '');
      setModalVisivel(true);
    }
  };

  const handleSalvarPerfil = async () => {
    try {
      setSalvando(true);

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('telefone', telefone);
      formData.append('cidade', cidade);
      formData.append('estado', estado);
      formData.append('rua', rua);
      formData.append('numero', numero);

      const resposta = await api.put('/usuarios/perfil', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUsuario(resposta.data);
      await AsyncStorage.setItem('@BStyle:usuario', JSON.stringify(resposta.data));
      setModalVisivel(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (erro) {
      console.error(erro);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setSalvando(false);
    }
  };

  const handleSair = async () => {
    await AsyncStorage.removeItem('@BStyle:token');
    await AsyncStorage.removeItem('@BStyle:usuario');
    delete api.defaults.headers.common['Authorization'];
    router.replace('/auth/login');
  };

  const obterUrlAvatar = () => {
    if (!usuario || !usuario.fotoPerfilUrl) return null;
    const foto = usuario.fotoPerfilUrl;
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
      if (foto.includes('localhost:8080')) {
        return foto.replace('localhost:8080', '192.168.0.8:8080');
      }
      return foto;
    }
    return `http://192.168.0.8:8080/uploads/${foto}`;
  };

  const obterInicial = () => {
    if (!usuario || !usuario.nome) return '?';
    return usuario.nome.charAt(0).toUpperCase();
  };

  const obterEnderecoFormatado = () => {
    if (!usuario) return 'Não informado';
    const partes = [usuario.rua, usuario.numero, usuario.cidade, usuario.estado];
    const completo = partes.filter(p => p && p.trim() !== '').join(', ');
    return completo || 'Não informado';
  };

  if (carregando) {
    return (
      <View style={styles.containerErro}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const urlAvatar = obterUrlAvatar();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>BStyle</Text>
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
          </View>

          <View style={styles.nomeContainer}>
            <Text style={styles.nomeUsuario}>{usuario?.nome}</Text>
            <TouchableOpacity style={styles.botaoEdit} onPress={abrirEdicao}>
              <Ionicons name="create-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoTexto}>E-mail: <Text style={styles.infoValor}>{usuario?.login}</Text></Text>
            <Text style={styles.infoTexto}>Contato: <Text style={styles.infoValor}>{usuario?.telefone || 'Não informado'}</Text></Text>
            <Text style={styles.infoTexto}>Endereço: <Text style={styles.infoValor}>{obterEnderecoFormatado()}</Text></Text>
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
          onPress={handleSair}
        >
          <Text style={styles.textoBotaoSair}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisivel} onRequestClose={() => setModalVisivel(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Editar Perfil</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalForm}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Nome:</Text>
                <TextInput style={styles.modalInput} value={nome} onChangeText={setNome} placeholder="Seu nome completo" />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Contato:</Text>
                <TextInput style={styles.modalInput} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" keyboardType="phone-pad" />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Rua:</Text>
                <TextInput style={styles.modalInput} value={rua} onChangeText={setRua} placeholder="Nome da rua" />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Número:</Text>
                <TextInput style={styles.modalInput} value={numero} onChangeText={setNumero} placeholder="Nº" />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Cidade:</Text>
                <TextInput style={styles.modalInput} value={cidade} onChangeText={setCidade} placeholder="Cidade" />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Estado:</Text>
                <TextInput style={styles.modalInput} value={estado} onChangeText={setEstado} placeholder="UF" maxLength={2} autoCapitalize="characters" />
              </View>
            </ScrollView>

            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setModalVisivel(false)} disabled={salvando}>
                <Text style={styles.modalTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalBotaoSalvar} onPress={handleSalvarPerfil} disabled={salvando}>
                {salvando ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalTextoSalvar}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}