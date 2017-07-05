<template>
<div>
    <div class="container">
        <img :src="getCurrentUrl()">
    </div>
    <div class="buffer">
        <div v-for="picture in buffer" :key="picture" :style="getBufferStyle(picture)"></div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'vote',
    computed: {
        ...mapGetters([
            'buffer',
            'current'
        ])
    },
    mounted() {
        this.$store.dispatch('LOAD_BUFFER')

        document.onkeydown = (e) => {
            if (e.keyCode === 38) {
                this.$store.dispatch('VOTE_CURRENT', { type: 'UP' })
                this.nextPic()
            }

            if (e.keyCode === 40) {
                this.$store.dispatch('VOTE_CURRENT', { type: 'DOWN' })
                this.nextPic()
            }
        }
    },
    methods: {
        nextPic: function() {
            this.$store.dispatch('ADVANCE_BUFFER')
        },
        getCurrentUrl: function() {
            if (!this.current) return ''

            return 'http://localhost:8000' + this.current.filename
        },
        getBufferStyle: function(picture) {
            return 'background-image: url(http://localhost:8000' + picture.filename + ');'
        }
    }
}
</script>

<style lang="scss" scoped>
div.container {
    overflow: hidden;
    width: 100%;
    height: 100vh;

    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
}

div.buffer {
    width: 0px;
    height: 0px;
    overflow: hidden;
}
</style>