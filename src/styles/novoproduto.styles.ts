import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  scrollContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    gap: 18,
  },
  tituloTela: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  imageUploadArea: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageUploadPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  textPlaceholderImg: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    color: '#000',
  },
  inputArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
    marginBottom: 8,
  },
  scrollChips: {
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 6,
    backgroundColor: '#f9f9f9',
  },
  chipSelecionado: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  textoChip: {
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
  },
  textoChipSelecionado: {
    color: '#fff',
  },
  botaoSalvar: {
    backgroundColor: '#24E300',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoBotaoSalvar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  carregandoContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  }
});