import { createStore } from 'vuex'
import { Manager } from "socket.io-client"
import { socketMap } from '../options/socket'

const manager = new Manager(socketMap.addr)
export default createStore({
    state: {
        socket: manager.socket("/"),
        onFocusUser: null,
        users: [],
        onlineUsers: [],
        message: [],
        addUser: false,
        emojis: [
            '😰', '😭', '😱', '😩', '😡', '💀', '👽', '🤓', '🥳', '🤬', '🤯', '🤒',
            '😺', '😹', '😻', '🤗', '😏', '😶', '😐', '😑', '😒', '🙄', '🤭', '🤫',
            '🤔', '😳', '😞', '😟', '😠', '😡', '😔', '😕', '🙁', '😣', '😖', '😫',
            '😨', '😦', '😧', '😢', '😥', '😪', '🤤', '🤕', '😴', '🤧', '😷', '😓',
            '😭', '😵', '😲', '🤐', '🤮', '💤', '👤', '👥', '🗣', '💩', '😈', '👿',
            '👹', '👺', '👻', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿',
            '😾', '🙌', '🤲', '👏', '👋', '👍', '👊', '🤟', '🖖', '✊', '👌', '✋',
            '👐', '💪', '🙏', '👆', '👇', '👈', '👉', '🖕', '🖐', '👂', '👃', '🤘',
            '💅', '👄', '👅', '👁', '👀', '🧠', '👶', '💄', '💋', '👯', '👫', '👬',
            '👦', '👧', '👨', '👩', '👱', '👴', '👵', '🧒', '🧑', '💇', '💆', '💑',
            '🧔', '🧓', '👲', '👳', '🧕', '👮', '👷', '💂', '🕵', '🎅', '🧙‍♂️', '🧙‍♀️',
            '🧚‍♂️', '🧚‍♀️', '🧛‍♂️', '🧛‍♀️', '🧜‍♂️', '🧜‍♀️', '🧝‍♂️', '🧝‍♀️', '🧞‍♂️', '🧞‍♀️', '🧟‍♂️', '🧟‍♀️',
            '🧖‍♂️', '🧖‍♀️', '🧗‍♂️', '🧗‍♀️', '🧘‍♂️', '🧘‍♀️', '👼', '👸', '👰', '🚶', '🏃', '💃',
            '🤱', '👭', '🙇', '💁', '🙅', '🙆', '🙋', '🤦‍♀️', '🤷‍♂️', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦',
            '🤷', '🙎', '🙍', '👩‍❤️‍👩', '👨‍❤️‍👨', '💏', '👩‍❤️‍💋‍👩', '👨‍❤️‍💋‍👨', '👪', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦',
            '👨‍👩‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👨‍👧‍👧', '👚', '👕', '👖', '👔', '👗',
            '👙', '👘', '👣', '👠', '👡', '👢', '👞', '🧢', '🧤', '👟', '👒', '🧣',
            '🧦', '🧥', '🎩', '🎓', '👑', '⛑', '🎒', '👝', '👛', '👜', '💼', '👓',
            '🕶', '💍', '🌂', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨',
            '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐙', '🐵', '🙈', '🙉', '🙊', '🐒',
            '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🌎',
            '🌍', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌝', '🌛',
            '🌜', '🌞', '🌙', '⭐️', '🌟', '💫', '🌤',
        ],
        currentVoice: null,
    },
    mutations: {
        usersHandel(state, payload) {
            state.users = payload
        },
        allUserVisableHandel(state, payload) {
            state.visable.login.allUserVisable = payload
        },
        onFocusUserHandel(state, payload) {
            state.onFocusUser = payload
        },
        messageHandel(state, payload) {
            if (payload.action === "message") {
                if (payload.user.id === state.onFocusUser.id) {
                    payload.role = 1
                } else if (payload.user.id !== state.onFocusUser.id) {
                    payload.role = 2
                }
            } else if (payload.action === "join") {
                payload.message = "join the room"
                payload.role = 3
            } else if (payload.action === "leave") {
                payload.message = "leave the room"
                payload.role = 3
            }
            state.message.push(payload)
        },
        onlineUsersHandel(state, payload) {
            state.onlineUsers = payload
        },
        speakHandel(state, payload) {
            state.currentVoice = payload
        },
        clearHandel(state) {
            state.message = []
        },
        addUserHandel(state, payload) {
            state.addUser = payload
        }
    },
    actions: {
        vconsole(context, payload) {
            const voice = payload
            speechSynthesis.speak(new SpeechSynthesisUtterance(voice));
            context.commit("speakHandel", voice)
        }
    },
})