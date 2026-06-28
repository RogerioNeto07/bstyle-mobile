import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function CadastroScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const handleCadastro = () => {
    router.replace('/auth/login');
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

            <TouchableOpacity style={styles.botaoFoto}>
              <Text style={styles.textoBotaoFoto}>Anexar Foto de Perfil</Text>
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail:</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome:</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Whatsapp:</Text>
              <TextInput style={styles.input} value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rua:</Text>
              <TextInput style={styles.input} value={rua} onChangeText={setRua} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Número:</Text>
              <TextInput style={styles.input} value={numero} onChangeText={setNumero} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cidade:</Text>
              <TextInput style={styles.input} value={cidade} onChangeText={setCidade} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estado:</Text>
              <TextInput style={styles.input} value={estado} onChangeText={setEstado} maxLength={2} autoCapitalize="characters" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha:</Text>
              <TextInput style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.labelLongo}>Confirmar senha:</Text>
              <TextInput style={styles.input} secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />
            </View>

            <TouchableOpacity style={styles.botaoCadastrar} onPress={handleCadastro}>
              <Text style={styles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
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
    marginBottom: 20,
    color: '#000',
  },
  botaoFoto: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'dashed',
    width: '100%',
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotaoFoto: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  label: {
    width: 90,
    fontSize: 14,
    color: '#000',
  },
  labelLongo: {
    width: 90,
    fontSize: 12,
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
  botaoCadastrar: {
    backgroundColor: '#24E300',
    paddingHorizontal: 40,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomBar: {
    height: 50,
    backgroundColor: '#000',
  },
});