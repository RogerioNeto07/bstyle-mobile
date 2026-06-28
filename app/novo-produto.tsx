import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function NovoProdutoScreen() {
  const router = useRouter();
  
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [cor, setCor] = useState('');
  const [descricao, setDescricao] = useState('');

  const tirarFoto = async () => {
    const permissaoCadeira = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissaoCadeira.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua câmera para registrar o produto.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const handleCadastrar = () => {
    if (!fotoUri || !nome || !preco || !tamanho || !cor || !descricao) {
      Alert.alert('Campos incompletos', 'Por favor, preencha todos os campos e tire uma foto do produto.');
      return;
    }

    Alert.alert('Sucesso', 'Produto cadastrado com sucesso!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logo}>BStyle</Text>
          <View style={styles.placeholderHeader} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.tituloForm}>Novo Produto:</Text>

            <View style={styles.campoLinhaFoto}>
              <Text style={styles.label}>Foto:</Text>
              <TouchableOpacity style={styles.boxFotoQuadrada} onPress={tirarFoto} activeOpacity={0.7}>
                {fotoUri ? (
                  <Image source={{ uri: fotoUri }} style={styles.previewImagem} />
                ) : (
                  <View style={styles.containerClickFoto}>
                    <Text style={styles.textoAnexar}>Adicionar arquivo</Text>
                    <Ionicons name="camera-outline" size={24} color="#000" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.campoLinha}>
              <Text style={styles.label}>Nome:</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} />
            </View>

            <View style={styles.campoLinha}>
              <Text style={styles.label}>Preço:</Text>
              <TextInput 
                style={styles.input} 
                value={preco} 
                onChangeText={setPreco} 
                keyboardType="numeric" 
                placeholder="0.00"
              />
            </View>

            <View style={styles.campoLinha}>
              <Text style={styles.label}>Tamanho:</Text>
              <TextInput style={styles.input} value={tamanho} onChangeText={setTamanho} />
            </View>

            <View style={styles.campoLinha}>
              <Text style={styles.label}>Cor:</Text>
              <TextInput style={styles.input} value={cor} onChangeText={setCor} />
            </View>

            <View style={styles.campoLinha}>
              <Text style={styles.label}>Descrição:</Text>
              <TextInput 
                style={[styles.input, styles.inputMultiline]} 
                value={descricao} 
                onChangeText={setDescricao} 
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity style={styles.botaoCadastrar} onPress={handleCadastrar} activeOpacity={0.8}>
              <Text style={styles.textoBotaoCadastrar}>Cadastrar</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tituloForm: {
    fontSize: 22,
    color: '#000',
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
  },
  campoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  campoLinhaFoto: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#000',
    width: 90,
    fontWeight: '400',
    paddingTop: 8,
  },
  input: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 12,
    color: '#000',
    fontSize: 16,
  },
  inputMultiline: {
    height: 90,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  boxFotoQuadrada: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    maxHeight: 180,
  },
  containerClickFoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#777',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  textoAnexar: {
    fontSize: 13,
    color: '#000',
  },
  previewImagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  botaoCadastrar: {
    backgroundColor: '#24E300',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '55%',
    alignSelf: 'center',
    marginTop: 10,
  },
  textoBotaoCadastrar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});