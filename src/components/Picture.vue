<template>
<div class="container">
    <transition name="zoom-fade">
        <div v-if="visible" class="picture">
            <div class="content">
                <img :src="url"></img>
            </div>
            <div class="meta">
                <div><div>{{ up }}</div></div>
                <div>{{ down }}</div>
                <div>{{ conf }}</div>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
export default {
    name: 'picture',
    props: [ 'data' ],
    data () {
        return {
            visible: false,
            url: 'http://localhost:8000' + this.data.filename,
            up: this.data.ups,
            down: this.data.downs,
            conf: Math.round(this.data.confidenceLevel * 1000, 4) / 1000
        }
    },
    mounted() {
        setTimeout(() => { this.visible = true }, Math.floor(Math.random() * 200))
        console.dir(this.data)
    }
}
</script>

<style lang="scss" scoped>
div.container {
    position: relative;
    width: 20%;
    height: 20vw;
    
    div.picture {
        position: relative;
        display: flex;
        background-color: #DDD;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;

        div.content {
            height: 100%;
            width: 100%;
            overflow: hidden;
            display: flex;

            img {
                max-height: 100%;
            }
        }

        > div.meta {
            color: rgba(255, 255, 255, 0.8);
            position: absolute;
            height: 15%;
            width: 100%;
            bottom: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            > div {
                dispay: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(50, 50, 50, 0.7);
                margin: 15% 2%;
                flex-grow: 1;
                height: 70%;
                display: flex;
            }
        }
    }
}

.zoom-fade-enter {
    transform: translateY(60px);
    opacity: 0;
}

.zoom-fade-enter-to {
    transform: translateY(0);
    opacity: 1;
}

.zoom-fade-enter-active, .zoom-fade-leave-active {
    transition: all .25s ease-out;
}
</style>