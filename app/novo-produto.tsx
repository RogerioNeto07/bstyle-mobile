import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../src/services/api';
import { styles } from '../src/styles/novoproduto.styles';

export default function NovoProdutoScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [descricao, setDescricao] = useState('');
  const [imagemUri, setImagemUri] = useState<string | null>(null);

  const [tipos, setTipos] = useState<any[]>([]);
  const [cores, setCores] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [tipoSelecionado, setTipoSelecionado] = useState<number | null>(null);
  const [coresSelecionadas, setCoresSelecionadas] = useState<number[]>([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState<number[]>([]);

  const [carregandoMetadados, setCarregandoMetadados] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregarMetadados = async () => {
      try {
        setCarregandoMetadados(true);
        const [resTipos, resCores, resTags] = await Promise.allSettled([
          api.get('/tipos'),
          api.get('/cores'),
          api.get('/tags')
        ]);

        if (resTipos.status === 'fulfilled') setTipos(resTipos.value.data);
        if (resCores.status === 'fulfilled') setCores(resCores.value.data);
        if (resTags.status === 'fulfilled') setTags(resTags.value.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregandoMetadados(false);
      }
    };

    carregarMetadados();
  }, []);

  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Aviso', 'É necessário conceder permissão para acessar a câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setImagemUri(resultado.assets[0].uri);
    }
  };

  const escolherFotoDaGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Aviso', 'É necessário conceder permissão para acessar a galeria.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setImagemUri(resultado.assets[0].uri);
    }
  };

  const selecionarImagem = () => {
    Alert.alert(
      'Imagem do Produto',
      'Como você deseja selecionar a imagem?',
      [
        { text: 'Tirar Foto (Câmera)', onPress: tirarFoto },
        { text: 'Escolher da Galeria', onPress: escolherFotoDaGaleria },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const alternarCor = (id: number) => {
    setCoresSelecionadas(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const alternarTag = (id: number) => {
    setTagsSelecionadas(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCadastrar = async () => {
    if (!nome.trim() || !preco.trim() || !quantidade.trim() || !tipoSelecionado) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o nome, preço, quantidade e a categoria.');
      return;
    }

    if (!imagemUri) {
      Alert.alert('Adicione uma foto', 'Selecione uma imagem para o produto antes de cadastrar.');
      return;
    }

    try {
      setSalvando(true);

      const formData = new FormData();
      formData.append('nome', nome.trim());
      formData.append('preco', parseFloat(preco).toString());
      formData.append('quantidade', parseInt(quantidade).toString());
      formData.append('descricao', descricao.trim());
      formData.append('tipoId', tipoSelecionado.toString());

      coresSelecionadas.forEach(corId => {
        formData.append('coresIds', corId.toString());
      });

      tagsSelecionadas.forEach(tagId => {
        formData.append('tagsIds', tagId.toString());
      });

      const uriParts = imagemUri.split('/');
      const originalFileName = uriParts[uriParts.length - 1];
      const extensao = originalFileName.split('.').pop()?.toLowerCase();
      
      const mimeType = (extensao === 'png') ? 'image/png' : 'image/jpeg';
      const fileName = originalFileName.includes('.') ? originalFileName : `foto_${Date.now()}.jpg`;

      const arquivoFoto = {
        uri: imagemUri,
        name: fileName,
        type: mimeType,
      } as any;

      formData.append('foto', arquivoFoto);
      formData.append('fotos', arquivoFoto);

      await api.post('/produtos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
    } finally {
      setSalvando(false);
    }
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

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContent}>
          <Text style={styles.tituloTela}>Novo Produto</Text>

          <TouchableOpacity style={styles.imageUploadArea} onPress={selecionarImagem}>
            {imagemUri ? (
              <Image source={{ uri: imagemUri }} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <View style={styles.imageUploadPlaceholder}>
                <Ionicons name="camera-outline" size={32} color="#888" />
                <Text style={styles.textPlaceholderImg}>Escolher Imagem do Produto</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do produto:</Text>
            <TextInput 
              style={styles.input} 
              value={nome} 
              onChangeText={setNome} 
              placeholder="Ex: Camiseta Vintage" 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preço (Digite 0 para DOAÇÃO):</Text>
            <TextInput 
              style={styles.input} 
              value={preco} 
              onChangeText={setPreco} 
              placeholder="Ex: 19.90 ou 0" 
              keyboardType="numeric" 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade em estoque:</Text>
            <TextInput 
              style={styles.input} 
              value={quantidade} 
              onChangeText={setQuantidade} 
              placeholder="Ex: 1" 
              keyboardType="numeric" 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição:</Text>
            <TextInput 
              style={[styles.input, styles.inputArea]} 
              value={descricao} 
              onChangeText={setDescricao} 
              placeholder="Conte detalhes sobre o produto, estado de conservação, etc..." 
              multiline 
              numberOfLines={3} 
            />
          </View>

          {carregandoMetadados ? (
            <View style={styles.carregandoContainer}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          ) : (
            <>
              {tipos.length > 0 && (
                <View style={styles.inputGroup}>
                  <Text style={styles.sectionTitle}>Categoria / Tipo:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {tipos.map((t) => (
                      <TouchableOpacity 
                        key={t.id} 
                        style={[styles.chip, tipoSelecionado === t.id && styles.chipSelecionado]} 
                        onPress={() => setTipoSelecionado(t.id)}
                      >
                        <Text style={[styles.textoChip, tipoSelecionado === t.id && styles.textoChipSelecionado]}>{t.nome}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {cores.length > 0 && (
                <View style={styles.inputGroup}>
                  <Text style={styles.sectionTitle}>Cores Disponíveis:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {cores.map((c) => (
                      <TouchableOpacity 
                        key={c.id} 
                        style={[styles.chip, coresSelecionadas.includes(c.id) && styles.chipSelecionado]} 
                        onPress={() => alternarCor(c.id)}
                      >
                        <Text style={[styles.textoChip, coresSelecionadas.includes(c.id) && styles.textoChipSelecionado]}>{c.nome}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {tags.length > 0 && (
                <View style={styles.inputGroup}>
                  <Text style={styles.sectionTitle}>Estilos / Tags:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                    {tags.map((t) => (
                      <TouchableOpacity 
                        key={t.id} 
                        style={[styles.chip, tagsSelecionadas.includes(t.id) && styles.chipSelecionado]} 
                        onPress={() => alternarTag(t.id)}
                      >
                        <Text style={[styles.textoChip, tagsSelecionadas.includes(t.id) && styles.textoChipSelecionado]}>{t.nome}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          <TouchableOpacity style={styles.botaoSalvar} onPress={handleCadastrar} disabled={salvando}>
            {salvando ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textoBotaoSalvar}>Salvar Produto</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}