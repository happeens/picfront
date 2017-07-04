<template>
<div class="container">
</div>
</template>

<script>
export default {
    name: 'vote',
    mounted() {
        document.onkeydown = (e) => {
            if (e.keyCode === 38)
                console.log('upvoted')

            if (e.keyCode === 40)
                console.log('downvoted')
        }
    }
}
</script>

<style lang="scss" scoped>
div.container {
    width: 100%;
    height: 100vw;
}
</style>