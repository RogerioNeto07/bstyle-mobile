import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../src/services/api';
import MeusProdutosCard from '../src/components/MeusProdutosCard';
import { styles } from '../src/styles/meusprodutos.styles';

export default function MeusProdutosScreen() {
  const router = useRouter();
  
  const [meusProdutos, setMeusProdutos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalVisivel, setModalVisivel] = useState<boolean>(false);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [produtoSendoEditado, setProdutoSendoEditado] = useState<any>(null);

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [novaImagemUri, setNovaImagemUri] = useState<string | null>(null);

  const [tipos, setTipos] = useState<any[]>([]);
  const [cores, setCores] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [tipoSelecionado, setTipoSelecionado] = useState<number | null>(null);
  const [coresSelecionadas, setCoresSelecionadas] = useState<number[]>([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState<number[]>([]);

  const carregarMeusProdutos = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await api.get('/produtos/meus-produtos');
      setMeusProdutos(resposta.data);
    } catch (err: any) {
      console.error(err);
      setErro("Não foi possível carregar seus produtos.");
    } finally {
      setCarregando(false);
    }
  };

  const carregarMetadados = async () => {
    try {
      const [resTipos, resCores, resTags] = await Promise.allSettled([
        api.get('/tipos'),
        api.get('/cores'),
        api.get('/tags')
      ]);
      if (resTipos.status === 'fulfilled') setTipos(resTipos.value.data);
      if (resCores.status === 'fulfilled') setCores(resCores.value.data);
      if (resTags.status === 'fulfilled') setTags(resTags.value.data);
    } catch (err) {
      console.warn("Usando chips de fallback estrutural");
    }
  };

  useEffect(() => {
    carregarMeusProdutos();
    carregarMetadados();
  }, []);

  const obterUrlImagem = (prod: any) => {
    if (!prod) return 'https://via.placeholder.com/150';
    const fotoDoProduto = prod.fotos;
    if (!fotoDoProduto) return 'https://via.placeholder.com/150';

    let nomeArquivo = '';
    if (typeof fotoDoProduto === 'string') {
      nomeArquivo = fotoDoProduto;
    } else if (Array.isArray(fotoDoProduto) && fotoDoProduto.length > 0) {
      const primeira = fotoDoProduto[0];
      nomeArquivo = typeof primeira === 'string' ? primeira : (primeira?.fotoUrl || primeira?.foto_url || '');
    } else if (typeof fotoDoProduto === 'object') {
      nomeArquivo = fotoDoProduto.fotoUrl || fotoDoProduto.foto_url || '';
    }

    if (!nomeArquivo) return 'https://via.placeholder.com/150';

    if (nomeArquivo.startsWith('http://') || nomeArquivo.startsWith('https://')) {
      if (nomeArquivo.includes('localhost:8080')) {
        return nomeArquivo.replace('localhost:8080', '192.168.0.8:8080');
      }
      return nomeArquivo;
    }

    return `http://192.168.0.8:8080/uploads/${nomeArquivo}`;
  };

  const escolherImagemdaGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para alterar a imagem.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setNovaImagemUri(resultado.assets[0].uri);
    }
  };

  const handleEditar = (produto: any) => {
    setProdutoSendoEditado(produto);
    setNome(produto.nome || '');
    setPreco(produto.preco !== undefined ? produto.preco.toString() : '0');
    setQuantidade(produto.quantidade !== undefined ? produto.quantidade.toString() : '1');
    setDescricao(produto.descricao || '');
    setNovaImagemUri(null);

    setTipoSelecionado(produto.tipoId || produto.tipo?.id || null);
    setCoresSelecionadas(produto.coresIds || produto.cores?.map((c: any) => c.id) || []);
    setTagsSelecionadas(produto.tagsIds || produto.tags?.map((t: any) => t.id) || []);

    setModalVisivel(true);
  };

  const alternarCor = (corId: number) => {
    setCoresSelecionadas(prev => 
      prev.includes(corId) ? prev.filter(id => id !== corId) : [...prev, corId]
    );
  };

  const alternarTag = (tagId: number) => {
    setTagsSelecionadas(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSalvarEdicao = async () => {
    if (!nome.trim() || !preco.trim() || !quantidade.trim()) {
      Alert.alert('Aviso', 'Preencha os campos obrigatórios.');
      return;
    }

    try {
      setSalvando(true);

      const formData = new FormData();
      formData.append('nome', nome.trim());
      formData.append('preco', parseFloat(preco).toString());
      formData.append('quantidade', parseInt(quantidade).toString());
      formData.append('descricao', descricao.trim());
      
      if (tipoSelecionado) {
        formData.append('tipoId', tipoSelecionado.toString());
      }
      
      coresSelecionadas.forEach(corId => {
        formData.append('coresIds', corId.toString());
      });

      tagsSelecionadas.forEach(tagId => {
        formData.append('tagsIds', tagId.toString());
      });

      if (novaImagemUri) {
        const uriParts = novaImagemUri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = fileName.split('.').pop();

        formData.append('foto', {
          uri: novaImagemUri,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      const resposta = await api.put(`/produtos/${produtoSendoEditado.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMeusProdutos(prev => prev.map(p => p.id === produtoSendoEditado.id ? resposta.data : p));
      setModalVisivel(false);
      Alert.alert('Sucesso', 'Produto atualizado com sucesso.');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = (id: number) => {
    Alert.alert(
      'Deletar Produto',
      'Tem certeza que deseja remover este produto permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/produtos/${id}`);
              setMeusProdutos(prev => prev.filter(p => p.id !== id));
              Alert.alert('Sucesso', 'Produto removido com sucesso.');
            } catch (err) {
              console.error(err);
              Alert.alert('Erro', 'Não foi possível remover o produto.');
            }
          }
        }
      ]
    );
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

      {erro ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="red" />
          <Text style={styles.textFeedback}>{erro}</Text>
          <TouchableOpacity style={styles.botaoTentarNovamente} onPress={carregarMeusProdutos}>
            <Text style={styles.textoBotaoTentar}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={meusProdutos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const fakePreco = item.preco === 0 ? {
              toFixed: () => 'DOAÇÃO',
              toString: () => 'DOAÇÃO',
              valueOf: () => 0
            } : item.preco;

            return (
              <MeusProdutosCard 
                produto={{
                  ...item,
                  preco: fakePreco
                }} 
                onEditar={() => handleEditar(item)} 
                onDeletar={handleDeletar} 
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={carregando}
          onRefresh={carregarMeusProdutos}
          ListHeaderComponent={
            <TouchableOpacity 
              style={styles.botaoAdicionar}
              onPress={() => router.push('/novo-produto')}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.textoBotaoAdicionar}>Adicionar Novo Produto</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <Text style={styles.textVazio}>Você ainda não possui produtos cadastrados.</Text>
          }
        />
      )}

      {}
      <Modal animationType="slide" transparent={true} visible={modalVisivel} onRequestClose={() => setModalVisivel(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Editar Produto</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalForm}>
              <View style={styles.previewImagemContainer}>
                <Image 
                  source={{ uri: novaImagemUri || obterUrlImagem(produtoSendoEditado) }} 
                  style={styles.previewImagem} 
                  resizeMode="cover" 
                />
                <TouchableOpacity style={styles.botaoAlterarImagem} onPress={escolherImagemdaGaleria}>
                  <Ionicons name="camera-outline" size={16} color="#fff" />
                  <Text style={styles.textoAlterarImagem}>Alterar Foto</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Nome do Produto:</Text>
                <TextInput style={styles.modalInput} value={nome} onChangeText={setNome} placeholder="Ex: Camisa de Linho" />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Preço (Coloque 0 para DOAÇÃO):</Text>
                <TextInput style={styles.modalInput} value={preco} onChangeText={setPreco} placeholder="Ex: 49.90 ou 0" keyboardType="numeric" />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Quantidade em Estoque:</Text>
                <TextInput style={styles.modalInput} value={quantidade} onChangeText={setQuantidade} placeholder="Ex: 5" keyboardType="numeric" />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Descrição:</Text>
                <TextInput style={[styles.modalInput, styles.modalInputArea]} value={descricao} onChangeText={setDescricao} placeholder="Descreva o produto..." multiline numberOfLines={3} />
              </View>

              {}
              {tipos.length > 0 && (
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>Categoria / Tipo:</Text>
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

              {}
              {cores.length > 0 && (
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>Cores Disponíveis:</Text>
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

              {}
              {tags.length > 0 && (
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>Tags / Estilos:</Text>
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
            </ScrollView>

            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.modalBotaoCancelar} onPress={() => setModalVisivel(false)} disabled={salvando}>
                <Text style={styles.modalTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalBotaoSalvar} onPress={handleSalvarEdicao} disabled={salvando}>
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