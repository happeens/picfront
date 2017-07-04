import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        pictures: []
    },
    actions: {
        LOAD_PICTURES: function ({ commit }) {
            setTimeout(() => {
                axios.get('http://localhost:8000/hotpics')
                    .then(res => {
                        console.dir(res)
                        commit('SET_PICTURES', {
                            pictures: res.data
                        })
                    })
            }, 500)
        }
    },
    mutations: {
        SET_PICTURES: (state, { pictures }) => {
            state.pictures = pictures
        }
    },
    getters: {
        pictures: state => state.pictures,
        pictureCount: state => state.pictures.length
    }
})