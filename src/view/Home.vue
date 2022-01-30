<template>
    <div class="bgc">
        <div class="header">
            <div class="left">
                <icon-bytedance-color class="icon-byte" />
                <span>Todo</span>
            </div>
            <div class="right">
                <span class="login" @click="login">登录</span>
                <span class="reg" @click="register">注册</span>
            </div>
        </div>
        <div class="text">
            <h1>Todo 有助于团队推进工作。</h1>
            <p>协作、管理项目并实现新的效率峰值。从摩天大楼到家庭办公室，您的团队工作方式始终都是独一无二的，但都可借助 Trello 来完成工作。</p>
        </div>
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { useRoute,useRouter } from 'vue-router'
import { IconBytedanceColor } from '@arco-design/web-vue/es/icon';
import { reactive, ref, defineComponent } from 'vue';
export default defineComponent({
    components: {
        IconBytedanceColor
    },
    setup(props) {
        const route = useRoute();
        const router = useRouter();
        const login = () => {
            router.push({name:'Login'})
        }
        const register = () => {
            router.push({name:'Register'})
        }
        return {
            login,
            register
        }
    }
})
</script>

<style scoped lang="less">
.bgc {
    background-color: rgb(235, 231, 255, 0.8);
    .header {
        padding: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc(100vw - 60px);
        height: 80px;
        .left {
            display: flex;
            align-items: center;
            justify-content: center;
            .icon-byte {
                height: 60px;
                width: 60px;
                margin-right: 20px;
            }
            span {
                font-weight: 900;
                font-size: 50px;
                font-family: Alibaba-PuHuiTi-Light;
            }
        }
        .right {
            display: flex;
            justify-content: center;
            align-items: center;
            .login {
                padding: 10px;
                display: inline-block;
                width: 60px;
                line-height: 40px;
                color: rgb(0, 101, 255);
                font-weight: 900;
                font-size: 25px;
                cursor: pointer;
            }
            .reg {
                margin-left: 20px;
                padding: 10px;
                display: inline-block;
                width: 60px;
                line-height: 40px;
                text-align: center;
                background-color: rgb(0, 101, 255);
                color: white;
                font-weight: 900;
                border-radius: 10px;
                cursor: pointer;
                font-size: 25px;
            }
            .reg:hover {
                background-color: rgb(0, 81, 204);
            }
        }
    }
    .text {
        height: 300px;
        width: 800px;
        margin-top: 250px;
        margin-left: 200px;
        h1{
            font-size: 60px;
        }
        p {
            font-size: 30px;
        }
    }
}
</style>