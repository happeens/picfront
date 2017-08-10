<template>
<div class="pictures">
    <picture v-for="picture in pictures" :data="picture" :key="picture"></picture>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Picture from '@/components/Picture'

export default {
    name: 'home',
    computed: {
        ...mapGetters([
            'pictures'
        ])
    },
    components: { Picture },
    mounted () {
        this.$store.dispatch('LOAD_PICTURES')
    }
}
</script>

<style lang="scss" scoped>
* {
    overflow: initial !important;
}
div.pictures {
    flex-direction: row;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
}
</style>
