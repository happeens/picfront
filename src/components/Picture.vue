<template>
<div class="container">
    <div class="checkbox">
        <input
            type="checkbox"
            name="censored"
            @click="changeCensoredStatus"
            v-model="censored"
            class="check"
            :disabled="checkDisabled"
        >
        censored
    </div>

    <div class="picture">
        <div class="content">
            <img :src="url"></img>
        </div>
        <div class="meta">
            <div><div>{{ up }}</div></div>
            <div>{{ down }}</div>
            <div>{{ conf }}</div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
    name: 'picture',
    props: [ 'data' ],
    computed: {
        ...mapGetters([
            'apiHost'
        ]),
        url () {
            return this.apiHost + this.data.filename
        }
    },
    methods: {
        changeCensoredStatus () {
            console.log('changing status to ' + this.censored)
            this.disabled = true
            axios.post(this.apiHost + '/' + this.picId, {
                censured: this.censored
            }).then((res) => {
                console.log('response')
                console.dir(res)
                this.disabled = false
            }).catch((err) => {
                console.log('error')
                console.dir(err)
            })
        }
    },
    data () {
        return {
            picId: this.data._id,
            up: this.data.ups,
            down: this.data.downs,
            conf: Math.round(this.data.confidenceLevel * 1000, 4) / 1000,
            censored: this.data.censured || false,
            checkDisabled: false
        }
    }
}
</script>

<style lang="scss" scoped>
div.container {
    position: relative;
    width: 20%;
    height: 20vw;
    display: flex;
    justify-content: center;

    div.checkbox {
        z-index: 1;
        position: absolute;
        top: 0;
        margin-top: 10%;
        padding: 10px 15px;
        background-color: rgba(#FFF, .3);
    }
    
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