<template>
<div class="container">
    <transition :name="currentAnimation">
        <div v-show="!turn">
            <img ref="currentimg">
        </div>
    </transition>

    <transition :name="currentAnimation">
        <div v-show="turn">
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
            currentAnimation: 'rotate'
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
            if(this.currentIndex >= this.$store.getters.pictures.length) {
                this.currentIndex = 0
            }
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
                    let animations = [
                        'slidetop',
                        'slidebottom',
                        'slideright',
                        'slideleft',
                        'fade',
                        'scale',
                        'rotate',
                        //'origami1',
                        //'door',
                        'scaledown',
                        'blur',
                        'hue',
                        'contrast'
                    ]
                    let i = parseInt(Math.random() * animations.length)
                    this.currentAnimation = animations[i];
                    console.log(this.currentAnimation)
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

body {
    background: black;
}
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
    will-change: transform;
    will-change: filter;

    img {
        overflow: hiddden;
        max-height: 100%;
        object-fit: contain;
    }
}

// fade animation
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}

.fade-enter-active, .fade-leave-active {
    transition: all 1s ease-in-out;
}

// slidetop animation
.slidetop-enter {
    transform: translate3d(0, -100%, 0);
}

.slidetop-leave-to {
    transform: translate3d(0, 100%, 0);
}

.slidetop-enter-active,  .slidetop-leave-active {
    transition: all 1s ease-in-out;
}


// slide animation
.slidebottom-enter {
    transform: translate3d(0, 100%, 0);
}

.slidebottom-leave-to {
    transform: translate3d(0, -100%, 0);
}

.slidebottom-enter-active,  .slidebottom-leave-active {
    transition: all 1s ease-in-out;
}

// slide animation
.slideright-enter {
    transform: translate3d(100%, 0, 0);
}

.slideright-leave-to {
    transform: translate3d(-100%, 0, 0);
}

.slideright-enter-active,  .slideright-leave-active {
    transition: all 1s ease-in-out;
}


// slide animation
.slideleft-enter {
    transform: translate3d(-100%, 0, 0);
}

.slideleft-leave-to {
    transform: translate3d(100%, 0, 0);
}

.slideleft-enter-active,  .slideleft-leave-active {
    transition: all 1s ease-in-out;
}

// scale animation
.scale-enter {
    transform: scale3d(0.7, 0.7, 1);
    opacity: 0;
}

.scale-leave-to {
    transform: scale3d(1.5, 1.5, 1);
    opacity: 0;
}

.scale-enter-active,  .scale-leave-active {
    transition: all 1s ease-in-out;
}

// rotate animationh
.rotate-leave-to {
    transform: rotateZ(360deg) scale3d(0.3, 0.3, 1);
    opacity: 0;
}

.rotate-enter {
    transform: rotateZ(-360deg) scale3d(0.3, 0.3, 1);
    opacity: 0;
}

.rotate-enter-active, .rotate-leave-active {
    transition: all 2s ease-in-out;
}

// origami 1
.origami1-enter {
    transform: scale3d(0.001, 1, 1);
    transform-origin: center left;
}

.origami1-leave-to {
    transform: scale3d(0.001, 1, 1);
    transform-origin: center right;
}

.origami1-enter-active, .origami1-leave-active {
    transition: all 1s linear;
}

// door
.door-enter {
    transform: rotate(-90deg);
    transform-origin: 100% 100%;
}

.door-enter-active, .door-leave-active {
    transition: all 1s ease-in-out;
}

//scaldown
.scaledown-enter {
    transform: scale3d(1.5, 1.5, 1);
    opacity: 0;
}

.scaledown-leave-to {
    transform: scale3d(0.7, 0.7, 1);
    opacity: 0;
}

.scaledown-enter-active, .scaledown-leave-active {
    transition: all 1s ease-in-out;
}

// blur animation
.blur-leave-to {
    filter: blur(100px);
    opacity: 0;
}

.blur-enter {
    filter: blur(100px);
    opacity: 0;
}

.blur-enter-active, .blur-leave-active {
    transition: all 1s ease-in-out;
}


// hue animation
.hue-leave-to {
    filter: hue-rotate(360deg);
    opacity: 0;
}

.hue-enter {
    filter: hue-rotate(-360deg);
    opacity: 0;
}

.hue-enter-active, .hue-leave-active {
    transition: all 1.5s ease-in-out;
}

// hue animation
.contrast-leave-to {
    filter: contrast(600%);
    opacity: 0;
}

.contrast-enter {
    filter: contrast(600%);
    opacity: 0;
}

.contrast-enter-active, .contrast-leave-active {
    transition: all 1s ease-in-out;
}


</style>
