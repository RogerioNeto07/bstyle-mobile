import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)');
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
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput 
              style={styles.input} 
              secureTextEntry 
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <TouchableOpacity style={styles.botaoEntrar} onPress={handleLogin}>
            <Text style={styles.textoBotao}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerAcoes}>
          <Text style={styles.textoFooter}>Ainda não possui conta?</Text>
          <Text style={styles.textoFooterSub}>cadastre-se agora:</Text>
          <TouchableOpacity style={styles.botaoCadastrar} onPress={() => router.push('/auth/cadastro')}>
            <Text style={styles.textoBotaoCadastrar}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  logo: {
    color: '#fff',
    fontSize: 36,
    fontFamily: 'InriaSerif-Bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 24,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  label: {
    width: 80,
    fontSize: 15,
    color: '#000',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#000',
  },
  botaoEntrar: {
    backgroundColor: '#24E300',
    width: 120,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  textoFooter: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  textoFooterSub: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  footerAcoes: {
    marginTop: 30,
    alignItems: 'center',
  },
  botaoCadastrar: {
    backgroundColor: '#C4C4C4',
    paddingHorizontal: 30,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textoBotaoCadastrar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bottomBar: {
    height: 50,
    backgroundColor: '#000',
  },
});