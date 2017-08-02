import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const BUFFER_SIZE = 5
const API_HOST = 'http://192.168.2.241'

export default new Vuex.Store({
    state: {
        pictures: [],
        buffer: [],
        loading: true
    },
    actions: {
        LOAD_PICTURES: function ({ state, commit }) {
            state.loading = true
            axios.get(API_HOST + '/hotpics')
                .then(res => {
                    commit('SET_PICTURES', {
                        pictures: res.data
                    })
                })
        },
        LOAD_BUFFER: function ({ state, commit }) {
            state.loading = true
            let proms = []

            for (var i = 0; i < BUFFER_SIZE; i++) {
                proms.push(axios.get(API_HOST + '/newpic'))
            }

            return Promise.all(proms)
                .then(responses => {
                    let buffer = []

                    responses.forEach(({ data }) => {
                        buffer.push(data)
                    })

                    commit('SET_BUFFER',  {
                        buffer: buffer
                    })
                })
        },
        ADVANCE_BUFFER: function ({ state, commit }) {
            state.loading = true
            // console.log('advancing buffer')
            return axios.get(API_HOST + '/newpic')
                .then(res => {
                    // console.log('got advanced pic')
                    commit('ADVANCE_BUFFER', {
                        nextPic: res.data
                    })
                })
        },
        VOTE_CURRENT: function ({ state }, payload) {
            state.loading = true
            // console.log(`voting ${payload.type}
                         // on pic ${state.buffer[0]}`)

            if (state.buffer.length == 0) return

            let type = payload.type.toUpperCase()
            if (['UP', 'DOWN'].indexOf(type) == -1) return

            let picId = state.buffer[0]._id
            axios.post(`${API_HOST}/${picId}/votes`, { type: type })
                .then(() => { console.log('voted ' + type) })
        }
    },
    mutations: {
        SET_PICTURES: (state, { pictures }) => {
            state.pictures = pictures
            state.loading = false
        },
        SET_BUFFER: (state, { buffer }) => {
            state.buffer = buffer
            state.loading = false
        },
        ADVANCE_BUFFER: (state, { nextPic }) => {
            state.buffer.splice(0, 1)
            state.buffer.push(nextPic)
            state.loading = false
        }
    },
    getters: {
        pictures: state => state.pictures,
        pictureCount: state => state.pictures.length,
        buffer: state => state.buffer,
        current: state => state.buffer.length > 0 ? state.buffer[0] : null,
        next: state => state.buffer.length > 1 ? state.buffer[1]: null,
        apiHost: () => API_HOST,
        loadingPics: state => state.loading
    }
})