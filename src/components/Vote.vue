<template>
<div class="container">
    <img :src="getCurrentUrl()">
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
        }
    }
}
</script>

<style lang="scss" scoped>
div.container {
    width: 100%;
    height: 100vw;

    img {
        width: 100%;
        height: 100vw;
        object-fit: cover;
    }
}
</style>