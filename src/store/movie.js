import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

const _defaultMessage = 'Search for the movie title!'

export default {
  namespaced: true,
  state: () => ({
    movies: [],
    message: _defaultMessage,
    loading: false,
    theMovie: {}
  }), 
  getters:{},
  
  // methods와 유사 // 변이 -> mutations에서만 데이터를 변경할 수 있음 // 즉 변경할 데이터를 정의함
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state) {
      state.movies = []
      state.message = _defaultMessage
      state.loading = false
    }
  }, 
  
  // actions에서는 직접적인 데이터 변경을 허용하지 않음 // 비동기로 처리하는 데이터 
  actions: {
    async searchMovies({ state, commit }, payload) {
      if(state.loading) {
        return
      }
      
      commit('updateState', {
        message: '',
        loading: true
      })
      
      try {
        const res = await _fetchMovie({
          ...payload,
          page: 1
        })
        const { Search, totalResults } = res.data
        commit('updateState', {
          movies: _uniqBy(Search, 'imdbID')
        })
        console.log(totalResults)
        console.log(typeof totalResults)
        
        const total = parseInt(totalResults,10)
        const pageLength = Math.ceil(total)
        
        // 추가 요청 전송
        if(pageLength > 1) {
          for(let page = 2; page <= pageLength; page++) {
            if(page > payload.number/10) {
              break
            }
            const res = await _fetchMovie({
              ...payload,
              page
            })
            const { Search } = res.data
            commit('updateState', {
              movies:[
                ...state.movies, 
                ..._uniqBy(Search, 'imdbID')]
            })
          }
        }
      } catch ({ message }) {
        commit('updateState', {
          movies:[],
          message
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    },
    async searchMovieWithId({ state, commit }, payload) {
      if(state.loading) return
      
      commit('updateState', {
        theMovie: {},
        loading: true
      })
      
      try {
        const res = await _fetchMovie(payload)
        console.log(res.data)
        commit('updateState', {
          theMovie : res.data
        })
      } catch(error) {
        commit('updateState', {
          theMovie: {}
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    }
  }
}

async function _fetchMovie(payload) {
  return await axios.post('/.netlify/functions/movie', payload)
}