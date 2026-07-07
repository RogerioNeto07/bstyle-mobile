import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#000',
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'InriaSerif-Bold',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginLeft: 16,
    paddingHorizontal: 10,
    height: 38,
  },
  inputBusca: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
    fontWeight: '500',
  },
  searchIcon: {
    marginLeft: 6,
  },
  subHeader: {
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
  },
  categoriasList: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
  },
  botaoCategoria: {
    backgroundColor: '#000',
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCategoria: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'InriaSerif-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  statusFiltroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  textFiltroStatus: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    fontFamily: 'InriaSerif-Regular',
  },
  botaoLimpar: {
    padding: 5,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  rowGrid: {
    justifyContent: 'space-between',
  },
  textVazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontFamily: 'InriaSerif-Regular',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textFeedback: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'InriaSerif-Regular',
  },
  botaoTentarNovamente: {
    marginTop: 15,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  textoBotaoTentar: {
    color: '#fff',
    fontWeight: 'bold',
  }
});