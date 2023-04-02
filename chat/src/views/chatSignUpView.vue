<template>
    <div class="container">
        
        <div class="signUpForm" id="signUpForm">
            <div class="userInpt">
                <p>userName:</p>
                <div class="userNameInpt">
                    <input type="text" placeholder="please type a name..." v-model="userName">
                </div>
                <p>userPassword:</p>
                <div class="userPasswordInpt">
                    <input type="password" placeholder="please type a password..." v-model="userPassowrd">
                </div>
                <p>Description:</p>
                <div class="userDescriptionInpt">
                    <input type="description" placeholder="please type a description..." v-model="description">
                </div>
                <p>Icon:</p>
                <div class="userIconInpt">
                    <input type="file" name="file" accept="image/*" ref="imgFile">
                </div>
            </div>
            <div>
                <button class="addUser" @click="addUser">添加</button>
                <button class="comeback" @click="backLogin">返回登陆</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

let userName = ref('')
let userPassowrd = ref('')
let description = ref('')
let imgFile = ref()

let addUser = () => {

}

let backLogin = () => {
    router.push("/")
    window.location.reload()
}
</script>
<style lang="scss" scoped>
.signUpForm {
    width: 600px;
    background-color: #e4e4e4;
    opacity: 0.9;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .userInpt {
        width: 100%;
        margin-bottom: 10px;

        p {
            font-size: 24px;
            margin: 10px;
        }

        .userNameInpt,
        .userPasswordInpt,
        .userIconInpt,
        .userDescriptionInpt {
            width: 100%;
            height: 50px;
            padding: 5px;
            background-color: white;
            border-radius: 5px;
            margin-bottom: 5px;

            input {
                width: 70%;
                height: 100%;
                line-height: 50px;
                padding-left: 10px;
                font-size: 20px;
                outline: none;
                border-radius: 5px;
            }
        }
    }
}
</style>