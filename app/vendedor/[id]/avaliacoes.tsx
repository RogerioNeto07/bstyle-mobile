import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image, Modal, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../src/services/api';
import { styles } from '../../../src/styles/avaliacao.styles';

export default function AvaliacoesScreen() {
  const router = useRouter();
  const { id, nome } = useLocalSearchParams();
  const vendedorId = Array.isArray(id) ? id[0] : id;

  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const [modalAvaliarVisivel, setModalAvaliarVisivel] = useState<boolean>(false);
  const [salvandoAvaliacao, setSalvandoAvaliacao] = useState<boolean>(false);
  const [nota, setNota] = useState<number>(5);
  const [comentario, setComentario] = useState<string>('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const [modalDenunciaVisivel, setModalDenunciaVisivel] = useState<boolean>(false);
  const [enviandoDenuncia, setEnviandoDenuncia] = useState<boolean>(false);
  const [motivo, setMotivo] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [resPerfil, resAvaliacoes] = await Promise.allSettled([
        AsyncStorage.getItem('@BStyle:usuario'),
        api.get(`/avaliacoes/vendedor/${vendedorId}`)
      ]);

      if (resPerfil.status === 'fulfilled' && resPerfil.value) {
        setUsuarioLogado(JSON.parse(resPerfil.value));
      }
      if (resAvaliacoes.status === 'fulfilled') {
        setAvaliacoes(resAvaliacoes.value.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (vendedorId) {
      carregarDados();
    }
  }, [vendedorId]);

  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Aviso', 'Permissão para usar a câmera é necessária.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!resultado.canceled && resultado.assets.length > 0) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const escolherGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Aviso', 'Permissão para acessar a galeria é necessária.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!resultado.canceled && resultado.assets.length > 0) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const selecionarOrigemImagem = () => {
    Alert.alert(
      'Foto do Produto Comprado',
      'Selecione o comprovante visual do produto:',
      [
        { text: 'Tirar Foto (Câmera)', onPress: tirarFoto },
        { text: 'Escolher da Galeria', onPress: escolherGaleria },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleCriarAvaliacao = async () => {
    if (!comentario.trim()) {
      Alert.alert('Aviso', 'Por favor, escreva um comentário para a avaliação.');
      return;
    }

    if (!fotoUri) {
      Alert.alert('Foto Obrigatória', 'É obrigatório anexar uma foto do produto para poder avaliar o vendedor.');
      return;
    }

    try {
      setSalvandoAvaliacao(true);

      const uriParts = fotoUri.split('/');
      const originalName = uriParts[uriParts.length - 1];
      const extensao = originalName.split('.').pop()?.toLowerCase();
      const mimeType = extensao === 'png' ? 'image/png' : 'image/jpeg';
      const fileName = `comprovante_${Date.now()}.${extensao || 'jpg'}`;

      const payload = {
        vendedorId: Number(vendedorId),
        compradorId: usuarioLogado ? Number(usuarioLogado.id) : null,
        nota: nota,
        comentario: comentario.trim(),
        fotoComprovanteUrl: fileName
      };

      const resposta = await api.post('/avaliacoes', payload);

      setAvaliacoes(prev => [resposta.data, ...prev]);
      setModalAvaliarVisivel(false);
      setFotoUri(null);
      setComentario('');
      setNota(5);
      Alert.alert('Sucesso', 'Sua avaliação foi publicada!');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível cadastrar a avaliação.');
    } finally {
      setSalvandoAvaliacao(false);
    }
  };

  const handleDenunciar = async () => {
    if (!motivo.trim() || !descricao.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o motivo e a descrição da sua denúncia.');
      return;
    }
    try {
      setEnviandoDenuncia(true);
      await api.post('/denuncias', {
        vendedorDenunciadoId: Number(vendedorId),
        motivo: motivo.trim(),
        descricao: descricao.trim()
      });
      setModalDenunciaVisivel(false);
      setMotivo('');
      setDescricao('');
      Alert.alert('Sucesso', 'A sua denúncia foi enviada e será analisada pela administração.');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível registrar a denúncia. Tente novamente mais tarde.');
    } finally {
      setEnviandoDenuncia(false);
    }
  };

  const obterUrlImagem = (foto: string) => {
    if (!foto) return 'https://placehold.co/150x150/000000/ffffff?text=Sem+Foto';
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
      if (foto.includes('localhost:8080')) {
        return foto.replace('localhost:8080', '192.168.0.8:8080');
      }
      return foto;
    }
    return `http://192.168.0.8:8080/uploads/${foto}`;
  };

  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

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
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.tituloTela}>
              Avaliações de{'\n'}{nome || 'Vendedor'}
            </Text>
            <TouchableOpacity 
              style={styles.botaoAvaliar}
              onPress={() => setModalAvaliarVisivel(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="star-outline" size={20} color="#fff" />
              <Text style={styles.textoBotaoAvaliar}>Avaliar Vendedor</Text>
            </TouchableOpacity>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image 
              source={{ uri: obterUrlImagem(item.fotoComprovanteUrl) }} 
              style={styles.imagemProduto} 
            />
            <View style={styles.infoContainer}>
              <Text style={styles.nomeUsuario}>{item.compradorNome || 'Comprador'}</Text>
              <View style={styles.estrelasContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons 
                    key={i} 
                    name={i < item.nota ? "star" : "star-outline"} 
                    size={14} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <Text style={styles.comentarioText}>{item.comentario}</Text>
            </View>
            <TouchableOpacity 
              style={styles.botaoDenunciar} 
              onPress={() => setModalDenunciaVisivel(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.textoBotaoDenunciar}>Denunciar</Text>
              <Ionicons name="warning-outline" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.textVazio}>Nenhuma avaliação encontrada para este vendedor.</Text>
        }
      />

      {/* MODAL DE ADICIONAR AVALIAÇÃO */}
      <Modal animationType="slide" transparent={true} visible={modalAvaliarVisivel} onRequestClose={() => setModalAvaliarVisivel(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Avaliar Vendedor</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalForm}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Nota:</Text>
                <View style={styles.seletorEstrelas}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setNota(star)}>
                      <Ionicons 
                        name={star <= nota ? "star" : "star-outline"} 
                        size={32} 
                        color="#FFD700" 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Foto do Produto (Obrigatório):</Text>
                <TouchableOpacity style={styles.imageUploadArea} onPress={selecionarOrigemImagem}>
                  {fotoUri ? (
                    <Image source={{ uri: fotoUri }} style={styles.imagePreview} resizeMode="cover" />
                  ) : (
                    <View style={styles.imageUploadPlaceholder}>
                      <Ionicons name="camera-outline" size={32} color="#888" />
                      <Text style={styles.textPlaceholderImg}>Tirar ou selecionar foto do produto</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Comentário:</Text>
                <TextInput 
                  style={[styles.modalInput, styles.modalInputArea]} 
                  value={comentario} 
                  onChangeText={setComentario} 
                  placeholder="Conte o que achou da compra, atendimento, etc..." 
                  multiline 
                  numberOfLines={3} 
                />
              </View>
            </ScrollView>

            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setModalAvaliarVisivel(false)} disabled={salvandoAvaliacao}>
                <Text style={styles.modalTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBotaoSalvar} onPress={handleCriarAvaliacao} disabled={salvandoAvaliacao}>
                {salvandoAvaliacao ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalTextoSalvar}>Enviar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE DENÚNCIA BASEADO NA TELA DE VENDEDOR */}
      <Modal animationType="slide" transparent={true} visible={modalDenunciaVisivel} onRequestClose={() => setModalDenunciaVisivel(false)}>
        <View style={styles.fundoModal}>
          <View style={styles.conteudoModal}>
            <View style={styles.headerModal}>
              <Text style={styles.tituloModal}>Denunciar Avaliação</Text>
              <TouchableOpacity onPress={() => setModalDenunciaVisivel(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.labelInput}>Motivo da Denúncia</Text>
            <TextInput 
              style={styles.inputMotivo} 
              value={motivo} 
              onChangeText={setMotivo} 
              placeholder="Ex: Fraude, Produto falso, Ofensas..." 
              placeholderTextColor="#999"
              maxLength={100}
            />

            <Text style={styles.labelInput}>Descrição detalhada</Text>
            <TextInput 
              style={styles.inputDescricao} 
              value={descricao} 
              onChangeText={setDescricao} 
              placeholder="Descreva detalhadamente o que aconteceu..." 
              placeholderTextColor="#999"
              multiline={true} 
              numberOfLines={4} 
              textAlignVertical="top"
            />

            <View style={styles.botoesModalContainer}>
              <TouchableOpacity style={styles.botaoCancelarModal} onPress={() => setModalDenunciaVisivel(false)} disabled={enviandoDenuncia}>
                <Text style={styles.textoCancelarModal}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoConfirmarModal} onPress={handleDenunciar} disabled={enviandoDenuncia}>
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
    </View>
  );
}