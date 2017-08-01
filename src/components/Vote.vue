<template>
<div class="outer">
    <div class="downvote" ref="downvote">
        <svg viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M1,4.27L2.28,3L20,20.72L18.73,22L15.18,18.44L13.45,20.03L12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,7.55 2.23,6.67 2.63,5.9L1,4.27M7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,11.07 20.42,13.32 17.79,15.97L5.27,3.45C5.95,3.16 6.7,3 7.5,3Z" />
        </svg>
    </div>
    <div class="upvote" ref="upvote">
        <svg viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
        </svg>
    </div>

    <div class="container" ref="current">
        <img :src="getCurrentUrl()" ref="first" class="first">
        <img :src="getNextUrl()" ref="second" class="second">
    </div>

    <div class="next" ref="next">
        <img :src="getNextUrl()">
    </div>

    <div class="buffer">
        <div
            v-for="picture in buffer"
            :key="picture"
            :style="getBufferStyle(picture)"
        ></div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hammer from 'hammerjs'

export default {
    name: 'vote',
    data () {
        return {
            timerId: 0
        }
    },
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
            .then(this.resetTimer)

        const upKeys = "uiopü+jklöä#nm,.-"
        const downKeys = 'qwertasdfgyxcv'

        document.onkeydown = (e) => {
            if (upKeys.indexOf(e.key) > -1) {
                this.$store.dispatch('VOTE_CURRENT', { type: 'UP' })
                this.$store.dispatch('ADVANCE_BUFFER').then(this.resetTimer)
            }

            if (downKeys.indexOf(e.key) > -1) {
                this.$store.dispatch('VOTE_CURRENT', { type: 'DOWN' })
                this.$store.dispatch('ADVANCE_BUFFER').then(this.resetTimer)
            }
        }

        // add hammerjs listeners
        let hammertime = new Hammer(this.$refs.current)
        let deltaX = 0
        let screenWidth = window.innerWidth

        hammertime.on('pan', (e) => {
            deltaX = e.deltaX
            let percent = deltaX / screenWidth
            let percentMoved = Math.abs(percent)
            let scale = (80 + (20 * percentMoved)) / 100
            let opacity = (50 + (50 * percentMoved)) / 100
            this.$refs.next.style.transform =
                `scale3d(${scale}, ${scale}, 1)`
            this.$refs.next.style.opacity = `${opacity}`
            this.$refs.current.style.transform =
                `translate3d(${e.deltaX}px, 0, 0)`

            if (percent >= 0.4) {
                this.$refs.upvote.classList.add('selected')
                this.$refs.downvote.classList.remove('selected')
            } else if (percent <= -0.4) {
                this.$refs.downvote.classList.add('selected')
                this.$refs.upvote.classList.remove('selected')
            } else {
                this.$refs.upvote.classList.remove('selected')
                this.$refs.downvote.classList.remove('selected')
            }
        })

        this.$refs.current.addEventListener('touchstart', touchStarted.bind(this))
        this.$refs.current.addEventListener('mousedown', touchStarted.bind(this))

        this.$refs.current.addEventListener('touchend', touchEnded.bind(this))
        this.$refs.current.addEventListener('mouseup', touchEnded.bind(this))

        function touchStarted() {
            this.$refs.upvote.classList.add('active')
            this.$refs.downvote.classList.add('active')
        }

        function touchEnded() {
            this.$refs.upvote.classList.remove('active')
            this.$refs.downvote.classList.remove('active')

            this.$refs.upvote.classList.remove('selected')
            this.$refs.downvote.classList.remove('selected')

            let percentMoved = Math.round((deltaX / screenWidth) * 100)
            let voteSign = Math.sign(percentMoved)

            if (Math.abs(percentMoved) > 30) {
                this.$refs.next.classList.add('animate')
                this.$refs.next.style.opacity = '1.0'
                this.$refs.next.style.transform = 'scale3d(1, 1, 1)'

                let translateXValue = 100 * voteSign

                let voteType = {
                    '1': 'UP',
                    '-1': 'DOWN'
                }

                this.$store.dispatch(
                    'VOTE_CURRENT',
                    { type: voteType[voteSign.toString()] }
                )

                deltaX = 0

                this.$refs.current.classList.add('animate')
                this.$refs.current.style.transform = `translate3d(${translateXValue}%, 0, 0)`
                setTimeout(() => {
                    this.$refs.first.style.display = 'none'
                    this.$refs.second.style.display = 'block'

                    this.$refs.current.style.transform = ''
                    this.$refs.current.classList.remove('animate')
                    this.$refs.next.classList.remove('animate')

                    this.$store.dispatch('ADVANCE_BUFFER').then(() => {
                        this.resetTimer()
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
        resetTimer () {
            clearTimeout(this.timerId)

            this.timerId = setTimeout(() => {
                this.$store.dispatch('ADVANCE_BUFFER')
                    .then(this.resetTimer)
            }, 30 * 1000)
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
    background-color: #313131;
}

.upvote, .downvote {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 20%;
    opacity: 0;
    z-index: 99;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10em;
    color: #FFF;

    &.active {
        opacity: .2;
    }

    &.active.selected {
        opacity: .7;
    }

    svg {
        width: 70%;
    }
}

.upvote {
    right: 0;
    background-color: #00B700;
}

.downvote {
    left: 0;
    background-color: #e71919;
}

.container, .next {
    overflow: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;

    img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        pointer-events: none;
    }

    img.second {
        display: none;
    }
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
    transform-origin: 50% 50%;
    transform: scale3d(0.8, 0.8, 1);
    opacity: 0.5;
}

div.buffer {
    width: 0px;
    height: 0px;
    overflow: hidden;
}
</style>