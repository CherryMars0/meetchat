<template>
    <div class="container">
        <alErt v-if="alert !== null" class="animate__animated" :class="{ animate__bounceIn: alert !== null }">{{ alert }}
        </alErt>
        <div class="userClient animate__animated animate__fadeRight" id="userClient">
            <div class="clientTitle">
                <div class="clientTitleNumber">
                    <p>Chat (<span>{{ onlineUsers.length + 1 }}</span>人)</p>
                </div>
                <div class="close">
                    <p @click="close">x</p>
                </div>
            </div>
            <div class="mainBottom">
                <div class="userList">
                    <ul>
                        <userItem :user="onFocusUser" role="self" />
                        <userItem v-for="(user, index) in onlineUsers" role="other" :user="user" :key="index" />
                    </ul>
                </div>
                <div class="messageBox">
                    <div class="outputBox" ref="optPutArea">
                        <div v-for="(message, index) in messages" :key="index">
                            <div class="broadcast" v-if="message.role !== 3">
                                <p>{{ message.date }}</p>
                            </div>
                            <div class="myself" v-if="message.role === 1">
                                <li>
                                    <img v-if="message.isImage" :src="message.message">
                                    <div v-if="!message.isImage" @click="speak(message.message)">
                                        <p v-if="checkString(message.message)">{{ parse(message.message) }}</p>
                                        <p>{{ message.message }}</p>
                                    </div>
                                    <img :src="message.user.Icon">
                                </li>
                            </div>
                            <div class="other" v-if="message.role === 2">
                                <li>
                                    <img :src="message.user.Icon">
                                    <div v-if="!message.isImage" @click="speak(message.message)">
                                        <p v-if="checkString(message.message)">{{ parse(message.message) }}</p>
                                        <p>{{ message.message }}</p>
                                    </div>
                                    <img v-if="message.isImage" :src="message.message">
                                </li>
                            </div>
                            <div class="broadcast" v-if="message.role === 3">
                                <p>{{ message.user.name }} {{ message.message }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="inputBox">
                        <div class="emoBox animate__animated" :class="{ animate__fadeIn: emoBoxVisable }"
                            v-show="emoBoxVisable">
                            <p v-for="(emoji, index) in emojis" :key="index" @click="choiceEmo(emoji)">{{ emoji }}</p>
                        </div>
                        <div class="controlBtn">
                            <img class="controlBtnEmo" src="../assets/images/emotion-line.png" @click="sendEmo()">
                            <button class="controlBtnPic" @click="clickFileIput">图片</button>
                            <button class="controlBtnMsg" @click="sendMsg('button')">发送</button>
                            <input ref="fileInput" type="file" @change="sendPic()" accept="image/*">
                        </div>
                        <textarea placeholder="输入消息" v-model="msg" @keyup.enter="sendMsg('enter')"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, computed, nextTick, onUpdated } from 'vue'
import userItem from '../components/userItem.vue'
import alErt from '../components/alErt.vue'
import { useStore } from 'vuex'
import router from '@/router'
import { pinyin } from 'pinyin-pro'

const store = useStore()
const fileInput = ref()
const optPutArea = ref()
let emoBoxVisable = ref(false)
let alert = ref(null)
let msg = ref('')

let parse = (string) => {
    return pinyin(string, { nonZh: 'consecutive' })
}

let checkString = (string) => {
    let Reg = new RegExp(`[\u4e00-\u9fa5]`)
    if (Reg.test(string)) {
        return true
    } else {
        return false
    }
}

let emojis = computed(() => {
    return store.state.emojis
})

let messages = computed(() => {
    scrollBottom()
    return store.state.message
})

let onFocusUser = computed(() => {
    return store.state.onFocusUser
})

let onlineUsers = computed(() => {
    let onlineUsers = store.state.onlineUsers
    let index = onlineUsers.findIndex(user => user.id == onFocusUser.value.id)
    onlineUsers.splice(index, 1)
    return onlineUsers
})

let close = () => {
    store.state.socket.emit("userExit")
    router.push('/')
}

let scrollBottom = () => {
    nextTick(() => {
        setTimeout(() => {
            optPutArea.value.scrollTo({
                top: optPutArea.value.scrollHeight,
                behavior: "smooth"
            })
        }, 60)
    })
}

let sendEmo = () => {
    emoBoxVisable.value = !emoBoxVisable.value
}

let speak = (str) => {
    store.dispatch("vconsole", str)
}

let choiceEmo = (emoji) => {
    msg.value = msg.value + (emoji)
    emoBoxVisable.value = false
}

let sendMsg = (key) => {
    if (key === 'enter') {
        if (msg.value.length > 1) {
            let trunk = { message: msg.value, user: onFocusUser.value, action: "message", isImage: false }
            store.state.socket.emit("broadcastMessage", trunk)
            msg.value = ''
        } else {
            tickAlert("输入内容不能为空")
        }
    } else if (key === 'button') {
        if (msg.value.length > 0) {
            let trunk = { message: msg.value, user: onFocusUser.value, action: "message", isImage: false }
            store.state.socket.emit("broadcastMessage", trunk)
            msg.value = ''
        } else {
            tickAlert("输入内容不能为空")
        }
    }
}

onUpdated(() => {
    scrollBottom()
})

let sendPic = () => {
    let file = fileInput.value.files[0]
    if (file && (file.size / 1024) <= 500) {
        let fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = () => {
            let trunk = { message: fr.result, user: onFocusUser.value, action: "message", isImage: true }
            store.state.socket.emit("broadcastImage", trunk)
        }
    } else {
        tickAlert("暂不支持超过500K的图片")
    }
    fileInput.value = null
}

let tickAlert = (str) => {
    alert.value = str
    setTimeout(() => {
        alert.value = null
    }, 2000)
}

const clickFileIput = () => {
    fileInput.value.click()
}

onMounted(() => {
    store.state.socket.on('broadcastMessage', (result) => {
        store.commit("messageHandel", result)
    })

    store.state.socket.on('broadcastImage', (result) => {
        store.commit("messageHandel", result)
    })

    store.state.socket.on('broadcastLogin', (result) => {
        store.commit("messageHandel", result)
    })

    store.state.socket.on('broadcastExit', (result) => {
        store.commit("messageHandel", result)
    })
})
</script>
<style lang="scss" scoped>
@import url("../assets/css/bob.scss");

.userClient {
    width: 800px;
    height: 600px;
    background-color: #e4e4e4;
    opacity: 0.9;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: .95 !important;

    .mainBottom {
        width: 800px;
        height: 550px;
        display: flex;

        .messageBox {
            width: 600px;
            height: 550px;

            .outputBox {
                padding: 10px;
                width: 100%;
                height: 400px;
                background-color: whitesmoke;
                box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
                overflow-y: auto !important;
                display: flex;
                flex-direction: column;

                .broadcast {
                    width: 100%;

                    p {
                        text-align: center;
                        color: #4e4e4e;
                    }
                }
            }

            .inputBox {
                width: 100%;
                height: 150px;
                background-color: white;
                box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: rgb(204, 219, 232);
                position: relative;

                .emoBox {
                    background-color: white;
                    position: absolute;
                    display: flex;
                    flex-wrap: wrap;
                    overflow-y: auto;
                    margin: 10px;
                    max-height: 90px;
                    padding: 15px;
                    margin-top: 50px;
                    border-radius: 5px;

                    p {
                        cursor: pointer;
                        padding: 5px;
                    }
                }

                .controlBtn {
                    width: 100%;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: right;

                    button:hover {
                        background-color: #4e4e4e;
                        color: white;
                    }

                    button {
                        margin-left: 5px;
                        margin-right: 5px;
                    }

                    input,
                    audio {
                        display: none;
                    }

                    img {
                        cursor: pointer;
                        transition: all linear 0.1s;
                    }

                    img:hover {
                        filter: invert(0.4);
                    }
                }

                textarea {
                    width: calc(100% - 6px);
                    height: 104px;
                    padding: 10px;
                    outline: none;
                    border: none;
                    resize: none;
                    background-color: rgba(255, 255, 255, 0.5);
                    box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 3px, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
                }
            }
        }

        .userList {
            width: 200px;
            height: 550px;
            box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
            background-color: #4e4e4e;
            overflow-y: auto !important;

            ul {
                width: 100%;
                height: auto;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
            }
        }
    }

    .clientTitle {
        width: 800px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .clientTitleNumber {
            width: 750px;
            height: 50px;

            p {
                text-align: center;
                font-size: 22px;
                line-height: 40px;
                margin-left: 80px;
            }
        }

        .close {
            width: 50px;
            height: 50px;
            cursor: pointer;

            p {
                margin-top: 5px;
                display: block;
                width: 30px;
                height: 30px;
                text-align: center;
                font-size: 16px;
                line-height: 30px;
                background-color: black;
                border-radius: 50%;
                color: whitesmoke;
                cursor: pointer;
                transition: all linear 0.1s;
            }

            p:hover {
                background-color: white;
                color: black;
            }
        }
    }
}

.myself {
    display: flex;
    justify-content: flex-end;

    li {
        display: flex;
        justify-content: flex-end;
    }
}

.other {
    display: flex;
    justify-content: flex-start;

    li {
        display: flex;
        justify-content: flex-start;
    }
}

.myself,
.other {
    width: 100%;

    li {
        width: 250px;
        margin-top: 20px;
        margin-bottom: 20px;

        div {
            background-color: #74b9ff;
            border-radius: 10px;
            cursor: pointer;

            p {
                display: block;
                line-height: 20px;
                max-width: 250px;
                min-width: 50px;
                padding: 10px;
                text-align: center;
                word-wrap: break-word;
                word-break: break-all;

            }

            :nth-of-type(2) {
                text-align: center;
                letter-spacing: 2px;
            }
        }

        img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            margin-left: 10px;
            border-radius: 10px;
        }
    }
}
</style>