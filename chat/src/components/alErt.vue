<template>
    <div class="alert">
        <p>
            <svg xmlns="http://www.w3.org/2000/svg" class="bi">
                <path
                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <a>
                <slot></slot>
            </a>
        </p>
    </div>
</template>

<style scoped lang="scss">
.alert {
    width: 300px;
    background-color: #cddeff;
    padding: 10px 40px;
    border-radius: 5px;
    position: fixed;
    top: 120px;
    left: 50%;
    margin-left: -150px;
    border: 1px solid #2c2ccc;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    z-index: 9999;

    p {
        display: flex;
        align-items: center;
        justify-content: center;

        .bi {
            margin-top: 3px;
            margin-right: 5px;
            width: 20px;
            height: 20px;
        }

        a {
            color: #2c2ccc;
        }
    }
}
</style>
