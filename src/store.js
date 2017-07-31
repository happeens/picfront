import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const BUFFER_SIZE = 5
// const API_HOST = 'http://192.168.2.138:8080'
const API_HOST = 'http://192.168.2.236:8000'

export default new Vuex.Store({
    state: {
        pictures: [],
        buffer: []
    },
    actions: {
        LOAD_PICTURES: function ({ commit }) {
            axios.get(API_HOST + '/hotpics')
                .then(res => {
                    commit('SET_PICTURES', {
                        pictures: res.data
                    })
                })
        },
        LOAD_BUFFER: function ({ commit }) {
            let proms = []

            for (var i = 0; i < BUFFER_SIZE; i++) {
                proms.push(axios.get(API_HOST + '/newpic'))
            }

            Promise.all(proms)
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
        ADVANCE_BUFFER: function ({ commit }) {
            return axios.get(API_HOST + '/newpic')
                .then(res => {
                    commit('ADVANCE_BUFFER', {
                        nextPic: res.data
                    })
                })
        },
        VOTE_CURRENT: function ({ state }, payload) {
            if (state.buffer.length == 0) return

            let type = payload.type.toUpperCase()
            if (['UP', 'DOWN'].indexOf(type) == -1) return

            let picId = state.buffer[0]._id
            axios.post(`${API_HOST}/${picId}/votes`, { type: type })
                .then(() => { console.log('voted successfully') })
        }
    },
    mutations: {
        SET_PICTURES: (state, { pictures }) => {
            state.pictures = pictures
        },
        SET_BUFFER: (state, { buffer }) => {
            state.buffer = buffer
        },
        ADVANCE_BUFFER: (state, { nextPic }) => {
            state.buffer.splice(0, 1)
            state.buffer.push(nextPic)
        }
    },
    getters: {
        pictures: state => state.pictures,
        pictureCount: state => state.pictures.length,
        buffer: state => state.buffer,
        current: state => state.buffer.length > 0 ? state.buffer[0] : null,
        next: state => state.buffer.length > 1 ? state.buffer[1]: null,
        apiHost: () => API_HOST
    }
})