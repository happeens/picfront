<template>
<div class="container">
    <transition :name="currentAnimation">
        <div v-show="!turn" class="current">
            <img ref="currentimg">
        </div>
    </transition>

    <transition :name="currentAnimation">
        <div v-show="turn" class="next">
            <img ref="nextimg">
        </div>
    </transition>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'show',
    data () {
        return {
            turn: false,
            currentIndex: 0,
            currentAnimation: 'slide'
        }
    },
    computed: {
        ...mapGetters([
            'pictures',
            'apiHost'
        ])
    },
    methods: {
        turnPics () {
            this.currentIndex++
            let imghost = this.apiHost + this.$store.getters.pictures[this.currentIndex].filename
            let img = new Image()
            img.src = imghost
            var self = this
            img.onload = () => {
                this.turn = !this.turn

                if (self.turn) {
                    self.$refs.nextimg.src = imghost
                } else {
                    self.$refs.currentimg.src = imghost
                }

                requestAnimationFrame(() => {
                    let animations = ['slide', 'fade']
                    let i = parseInt(Math.random() * animations.length)
                    this.currentAnimation = animations[i];
                })
            }
        }
    },
    mounted () {
        this.$store.dispatch('LOAD_SHOW_PICTURES')
            .then(() => {
                var img = new Image()
                let imghost = this.apiHost + this.$store.getters.pictures[this.currentIndex].filename
                img.src = imghost
                var self = this
                img.onload = () => {
                    self.$refs.currentimg.src = imghost
                }

                setInterval(this.turnPics, 5 * 1000)
            })
    }
}
</script>

<style lang="scss">
* {
    overflow: hidden;
}
.container {
    background-color: #000;
}

.container > div {
    background-color: #000;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100%;
    backface-visibility: hidden;
    transform-style: preserve-3d;

    img {
        overflow: hiddden;
        max-height: 100%;
        object-fit: contain;
    }
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}

.fade-enter-active, .fade-leave-active {
    transition: all 1s ease-in-out;
}

.slide-enter {
    transform: translate3d(-100%, 0, 0);
}

.slide-leave-to {
    transform: translate3d(100%, 0, 0);
}

.slide-enter-active,  .slide-leave-active {
    transition: all 1s ease-in-out;
}
</style>

