import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '../../src/services/api';
import { styles } from '../../src/styles/cadastro.styles';

export default function CadastroScreen() {
  const router = useRouter();
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [carregando, setCarregando] = useState(false);

  const lidarSelecaoImagem = () => {
    Alert.alert(
      'Selecione uma Foto',
      'De onde você deseja escolher a sua foto de perfil?',
      [
        { text: 'Tirar Foto (Câmera)', onPress: tirarFoto },
        { text: 'Escolher da Galeria', onPress: escolherDaGaleria },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const tirarFoto = async () => {
    const permissaoCamera = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissaoCamera.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua câmera para registrar a foto.');
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

  const escolherDaGaleria = async () => {
    const permissaoGaleria = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissaoGaleria.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para escolher a foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const handleCadastro = async () => {
  if (!email || !nome || !senha || !confirmarSenha) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  if (senha !== confirmarSenha) {
    Alert.alert('Erro', 'As senhas informadas não coincidem.');
    return;
  }

  try {
    setCarregando(true);
    const dadosFormulario = new FormData();

    dadosFormulario.append('login', email.trim());
    dadosFormulario.append('nome', nome.trim());
    dadosFormulario.append('telefone', whatsapp.trim());
    dadosFormulario.append('senha', senha);
    dadosFormulario.append('rua', rua.trim());
    dadosFormulario.append('numero', numero.trim());
    dadosFormulario.append('cidade', cidade.trim());
    dadosFormulario.append('estado', estado.trim().toUpperCase());

    if (fotoUri) {
      const nomeArquivo = fotoUri.split('/').pop();
      const matchExtensao = /\.(\w+)$/.exec(nomeArquivo || '');
      const tipoArquivo = matchExtensao ? `image/${matchExtensao[1]}` : `image/jpeg`;

      dadosFormulario.append('foto', {
        uri: fotoUri,
        name: nomeArquivo || 'perfil.jpg',
        type: tipoArquivo,
      } as any);
    }

    await api.post('/auth/registrar', dadosFormulario, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    Alert.alert('Sucesso 🎉', 'Conta criada com sucesso! Faça login para continuar.');
    router.replace('/auth/login');
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário:', error);
    Alert.alert('Erro', 'Não foi possível efetuar o cadastro. Verifique os dados inseridos.');
  } finally {
    setCarregando(false);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>BStyle</Text>
      </View>

      <View style={styles.content}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cadastre-se no BStyle</Text>

            <TouchableOpacity style={styles.botaoFoto} onPress={lidarSelecaoImagem} disabled={carregando}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={{ width: '100%', height: '100%', borderRadius: 8, resizeMode: 'cover' }} />
              ) : (
                <Text style={styles.textoBotaoFoto}>Anexar Foto de Perfil</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail *:</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!carregando} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome *:</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} editable={!carregando} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Whatsapp:</Text>
              <TextInput style={styles.input} value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" editable={!carregando} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rua:</Text>
              <TextInput style={styles.input} value={rua} onChangeText={setRua} editable={!carregando} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Número:</Text>
              <TextInput style={styles.input} value={numero} onChangeText={setNumero} editable={!carregando} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cidade:</Text>
              <TextInput style={styles.input} value={cidade} onChangeText={setCidade} editable={!carregando} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estado:</Text>
              <TextInput style={styles.input} value={estado} onChangeText={setEstado} maxLength={2} autoCapitalize="characters" editable={!carregando} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha *:</Text>
              <TextInput style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} editable={!carregando} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.labelLongo}>Confirmar senha *:</Text>
              <TextInput style={styles.input} secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} editable={!carregando} />
            </View>

            <TouchableOpacity style={styles.botaoCadastrar} onPress={handleCadastro} disabled={carregando}>
              {carregando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.textoBotao}>Cadastrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomBar} />
    </View>
  );
}