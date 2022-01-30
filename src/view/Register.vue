<template>
    <div class="bgc">
        <div class="center">
            <header>
                <icon-bytedance-color class="icon-byte" />
                <span>Todo</span>
            </header>
            <div class="login">
                <span class="title">注册您的账户</span>
                <form class="form">
                    <input type="text" name="fullname" placeholder="输入你的全名" class="fullname" v-model="form.fullname"/>
                    <input
                        type="text"
                        name="username"
                        style="display: block;"
                        placeholder="输入你的邮箱"
                        class="username"
                        v-model="form.username"
                    />
                    <input type="text" name="verifyCode" class="password" placeholder="输入你的邮箱验证码" v-model="form.verifyCode"/>
                    <input type="password" name="password" placeholder="输入你的密码" class="password" v-model="form.password"/>
                    <input class="submit" value="注册" @click="register"/>
                </form>
                <router-link to="Login" class="rebuilt">已有账号？登录</router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IconBytedanceColor } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref, defineComponent } from 'vue';
import {registerUser} from '../axios/api'
import router from '@/router';
export default defineComponent({
    components: {
        IconBytedanceColor
    },
    setup(props) {
        const form = reactive({
            fullname:"",
            username: "",
            verifyCode:"",
            password: ""
        })
        const json = JSON.stringify(form);
        async function register() {
            try {
                const res = await registerUser(form);
                Message.success({content:"注册成功！"});
                localStorage.setItem('token',`${res}`);
                router.push('/Layout');
            } catch (error) {
                Message.error({content:"账号已经存在"})
            }  
        }
        return{
            form,
            register
        }
    }
})
</script>

<style scoped lang="less">
.bgc {
    background-color: rgb(249, 250, 252);
    display: flex;
    justify-content: center;
    .center {
        padding: 40px;
        height: calc(100vh - 80px);
        width: 600px;
        header {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
            .icon-byte {
                height: 60px;
                width: 60px;
                margin-right: 20px;
            }
            span {
                font-weight: 900;
                font-size: 50px;
                font-family: Alibaba-PuHuiTi-Light;
                color: rgb(37, 56, 88);
            }
        }
        .login {
            width: 100%;
            height: 700px;
            background-color: white;
            box-shadow: rgb(0 0 0 / 10%) 0 0 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            span.title {
                display: inline-block;
                color: rgb(94, 108, 132);
                margin-top: 50px;
                font-size: 24px;
                font-weight: 900;
            }
            .form {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 50px;
                width: 450px;
                input:focus {
                    outline: none;
                    border: 5px solid rgb(76, 154, 255);
                }
                .fullname {
                    width: 100%;
                    border: 5px solid #dfe1e6;
                    background-color: rgb(232, 240, 254);
                    height: 60px;
                    border-radius: 5px;
                    margin-bottom: 40px;
                    font-size: 24px;
                }
                .username {
                    width: 100%;
                    border: 5px solid #dfe1e6;
                    background-color: rgb(232, 240, 254);
                    height: 60px;
                    border-radius: 5px;
                    margin-bottom: 40px;
                    font-size: 24px;
                }
                .password {
                    width: 100%;
                    border: 5px solid #dfe1e6;
                    background-color: rgb(232, 240, 254);
                    height: 60px;
                    border-radius: 5px;
                    font-size: 24px;
                    margin-bottom: 30px;
                }
                .submit {
                    width: 100%;
                    background-color: rgb(90, 172, 68);
                    height: 60px;
                    border-radius: 5px;
                    color: white;
                    text-align: center;
                    font-size: 24px;
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                }
            }
            .rebuilt {
                margin-top: 30px;
            }
        }
    }
}
</style>