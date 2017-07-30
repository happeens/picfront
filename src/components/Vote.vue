<template>
<div class="outer">
    <div class="container" ref="current">
        <img :src="getCurrentUrl()" ref="first" class="first">
        <img :src="getNextUrl()" ref="second" class="second">
    </div>

    <div class="next">
        <img :src="getNextUrl()">
    </div>

    <div class="buffer">
        <div v-for="picture in buffer" :key="picture" :style="getBufferStyle(picture)"></div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hammer from 'hammerjs'

export default {
    name: 'vote',
    computed: {
        ...mapGetters([
            'buffer',
            'current',
            'next',
            'apiHost'
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

        // add hammerjs listeners
        let hammertime = new Hammer(this.$refs.current)
        let deltaX = 0
        let screenWidth = window.innerWidth
        hammertime.on('pan', (e) => {
            deltaX = e.deltaX
            this.$refs.current.style.transform =
                `translate3d(${e.deltaX}px, 0, 0)`
        })

        this.$refs.current.addEventListener('touchend', touchEnded.bind(this))
        this.$refs.current.addEventListener('mouseup', touchEnded.bind(this))

        function touchEnded() {
            let percentMoved = Math.round((deltaX / screenWidth) * 100)
            let voteSign = Math.sign(percentMoved)
            if (Math.abs(percentMoved) > 40) {
                let translateXValue = 100 * voteSign

                let voteType = {
                    '1': 'UP',
                    '-1': 'DOWN'
                }

                this.$store.dispatch(
                    'VOTE_CURRENT',
                    { type: voteType[voteSign.toString()] }
                )

                this.$refs.current.classList.add('animate')
                this.$refs.current.style.transform = `translate3d(${translateXValue}%, 0, 0)`
                setTimeout(() => {
                    this.$refs.first.style.display = 'none'
                    this.$refs.second.style.display = 'block'

                    this.$refs.current.style.transform = ''
                    this.$refs.current.classList.remove('animate')

                    this.$store.dispatch('ADVANCE_BUFFER').then(() => {
                        this.$refs.first.style.display = ''
                        this.$refs.second.style.display = ''
                    })
                }, 100)

                return
            }

            this.$refs.current.classList.add('animate')
            this.$refs.current.style.transform = 'translate3d(0, 0, 0)'
            setTimeout(() => {
                this.$refs.current.classList.remove('animate')
            }, 100)
        }
    },
    methods: {
        nextPic () {
            this.$store.dispatch('ADVANCE_BUFFER')
        },
        getCurrentUrl () {
            if (!this.current) return ''

            return this.apiHost + this.current.filename
        },
        getNextUrl () {
            if (!this.next) return ''

            return this.apiHost + this.next.filename
        },
        getBufferStyle: function(picture) {
            let url = this.apiHost + picture.filename
            return `background-image: url(${url});`
        }
    }
}
</script>

<style lang="scss">
html, body {
    overflow: hidden;
}

.container, .next {
    overflow: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        pointer-events: none;
    }

    img.second {
        display: none;
    }
}

.container.transitioning {
}

.animate {
    transition: all .1s linear;
    pointer-events: none;
}

.container {
    z-index: 1;
}

.next {
    z-index: 0;
}

div.buffer {
    width: 0px;
    height: 0px;
    overflow: hidden;
}
</style>