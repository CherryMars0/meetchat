<template>
  <div class="container">
    <div class="loading" v-if="loading"></div>
    <div v-else class="loginForm animate__animated animate__fadeRight" id="loginForm">
      <div class="userNameInpt">
        <input type="text" placeholder="please type a name...">
      </div>
      <div class="userIcon">
        <ul v-if="allUserVisable">
          <li v-for="(user, index) in users" :key="user.id">
            <img @click="onFocusUserHandel(user, index)" :src="user.Icon" :alt="user.description" :userID="user.id"
              :title="user.description">
            <p>{{ user.name }}</p>
          </li>
        </ul>
        <ul v-if="!allUserVisable">
          <li>
            <img :src="onFocusUser.Icon" :alt="onFocusUser.description">
            <p>{{ onFocusUser.name }}</p>
          </li>
        </ul>
      </div>
      <div>
        <button class="loginBtn" @click="loginHandel()">登陆</button>
        <button class="registerBtn" @click="signUpHandel()">添加</button>
        <button class="allUserBtn" @click="allUserHandel()">所有用户</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useStore()
let allUserVisable = ref(true)
let loading = ref(true)

const users = computed(() => {
  return store.state.users
})

const onFocusUser = computed(() => {
  return store.state.onFocusUser
})

let loginHandel = () => {
  if (onFocusUser.value !== null) {
    store.state.socket.emit("login", onFocusUser.value)
    store.state.socket.on("broadcastLogin", data => {
      if (data.user !== null) {
        store.state.socket.on('newUserList', (result) => {
          store.commit("onlineUsersHandel", result)
        })
        router.push("/main")
      } else {
        store.commit("clearHandel")
        alert("该用户重复登录！")
        router.push("/")
        window.location.reload()
      }
    })
  } else {
    alert("please choose a login")
  }
}

let signUpHandel = () => {
  store.commit("addUserHandel", true)
  router.push("/signup")
}

let allUserHandel = () => {
  store.commit("onFocusUserHandel", null)
  allUserVisable.value = true
}

let onFocusUserHandel = (user) => {
  store.commit("onFocusUserHandel", user)
  allUserVisable.value = false
}

onMounted(() => {
  store.state.socket.on("broadcastJoin", (data) => {
    store.commit("usersHandel", JSON.parse(data))
  })

  setTimeout(() => {
    loading.value = false
  }, 1000);
})

</script>
<style lang="scss" scoped>
@import url('../assets/css/loading.scss');

.loginForm {
  width: 600px;
  background-color: #e4e4e4;
  opacity: 0.9;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .userNameInpt {
    width: 100%;
    height: 50px;
    padding: 5px;
    background-color: white;
    border-radius: 5px;
    margin-bottom: 5px;

    input {
      width: 100%;
      height: 100%;
      line-height: 50px;
      padding-left: 10px;
      font-size: 20px;
      outline: none;
      border-radius: 5px;
    }
  }

  .userIcon {
    width: 100%;
    padding: 5px;
    border-radius: 5px;
    background-color: white;
    margin-bottom: 10px;

    ul {
      width: 100%;
      height: 100%;
      background-color: #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      flex-basis: auto;
      align-items: center;
      justify-content: center;

      li {
        width: 70px;
        height: 70px;
        margin: 20px;
        border-radius: 50%;
        cursor: pointer;
        transform: scale(0.9);
        transition: 0.1s linear;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        p {
          text-align: center;
          margin-left: -10px;
        }
      }

      li:hover {
        transform: scale(1);
      }
    }
  }
}
</style>