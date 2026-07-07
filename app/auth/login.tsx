import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../src/services/api';
import { styles } from '../../src/styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !senha.trim()) {
      Alert.alert('Aviso', 'Preencha o usuário e a senha.');
      return;
    }

    try {
      setCarregando(true);

      const resposta = await api.post('/auth/login', {
        login: usuario.trim(),
        senha: senha
      });

      const credenciaisBase64 = btoa(`${usuario.trim()}:${senha}`);
      api.defaults.headers.common['Authorization'] = `Basic ${credenciaisBase64}`;

      await AsyncStorage.setItem('@BStyle:token', credenciaisBase64);

      await AsyncStorage.setItem('@BStyle:usuario', JSON.stringify(resposta.data));

      router.replace('/(tabs)');

    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro de Autenticação', 'Usuário ou senha incorretos.');
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Faça login no BStyle</Text>
          
         <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuário:</Text>
            <TextInput 
              style={styles.input} 
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              editable={!carregando}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput 
              style={styles.input} 
              secureTextEntry 
              value={senha}
              onChangeText={setSenha}
              editable={!carregando}
            />
          </View>

          <TouchableOpacity style={styles.botaoEntrar} onPress={handleLogin} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.textoBotao}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerAcoes}>
          <Text style={styles.textoFooter}>Ainda não possui conta?</Text>
          <Text style={styles.textoFooterSub}>cadastre-se agora:</Text>
          <TouchableOpacity style={styles.botaoCadastrar} onPress={() => router.push('/auth/cadastro')} disabled={carregando}>
            <Text style={styles.textoBotaoCadastrar}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomBar} />
    </View>
  );
}