<template>
    <li>
        <img :src="user.Icon">
        <div>
            <p>{{ user.name }}</p>
            <p>role:{{ role }}</p>
        </div>
    </li>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps(['user', 'role'])
let user = props.user
</script>
<style lang="scss" scoped>
li {
    width: calc(100% - 20px);
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: whitesmoke;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
    cursor: pointer;
    transition: all linear .2s;
    border-radius: 1px;
    margin: 10px;
    background-color: white;
    color: black;
    border-radius: 5px;

    img {
        margin-right: 10px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
}

li:hover {
    background-color: black;
    color: white;
    border-radius: 5px;

    img {
        filter: invert(0.2);
    }
}
</style>