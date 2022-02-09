<template>
    <div class="bgc">
        <div class="center">
            <div>
                <span>{{ inviteUserName }}</span>
                <span style="font-size: 1.5vw;font-weight: 500;">邀请你加入</span>
                <span>{{ productName }}</span>
            </div>
            <div class="button">
                <a-button type="primary" class="login" v-show="tokenExpire" @click="login">登录</a-button>
                <a-button type="primary" class="login" v-show="!tokenExpire" @click="confirm">确认加入项目</a-button>
                <a-button class="reg" v-show="tokenExpire" @click="reg">注册</a-button>
                <div>{{ userId }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IconBytedanceColor } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, toRefs, toRef, computed, onBeforeUpdate, onMounted, Ref } from "vue";
import { inviteShow, currentUser, invitePerson } from "@/axios/api";
import { useRouter, useRoute } from "vue-router";
import { useRequest } from "@/hooks/useRequest";
import { on } from "events";

export default defineComponent({
    components: {

    },
    setup(props) {
        const router = useRouter();
        const route = useRoute();
        let tokenExpire = ref(Boolean(null));
        let productName = ref(String(null));
        let inviteUserName = ref(String(null));
        let loginOradd = ref(null);
        let userId: Ref<Number | null> = ref(null);
        const productId = computed(() => {
            return route.params.productId;
        });
        const link = computed(() => {
            return route.params.link;
        })
        let data = reactive({
            productId: Number(productId.value),
            secret: String(link.value),
            userId: Number("")
        })
        const show = async () => {
            const res = await inviteShow(productId.value, link.value);
            tokenExpire.value = res.tokenExpire;
            productName.value = res.productName;
            inviteUserName.value = res.inviteUserName;
            if (tokenExpire.value === false) {
                let user = await currentUser();
                data.userId = user.userId
            }else {
                let json = JSON.stringify(data)
                localStorage.setItem('user',`${json}`)
                localStorage.setItem('url',`${link.value}`)
            }
        }
        show();
        const login = () => {
            router.push({name:"Login"})
        }
        const reg = () => {
            router.push({name:"Register"})
        }
        const confirm = async () => {
            try {
                let res = await invitePerson(data);
                router.push({ name: 'Board', params: { productId: productId.value } })
            } catch (error) {
                Message.error({content:"加入项目失败"})
            }
        }
        return {
            tokenExpire,
            productName,
            inviteUserName,
            confirm,
            userId,
            login,
            reg
        };
    },
});
</script>

<style scoped lang="less">
.bgc {
    background-color: rgb(249, 250, 252);
    display: flex;
    justify-content: center;
    align-items: center;
    .center {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        height: 760px;
        width: 1400px;
        padding: 20px;
        box-shadow: 0 8px 16px -4px #091e4240, 0 0 0 1px #091e4214;
        background-color: rgb(255, 255, 255);
        span {
            font-size: 3vw;
            font-weight: 800;
            margin-right: 20px;
        }
        .button {
            margin-top: 300px;
            // width: 800px;
            .login {
                width: 180px;
                height: 100px;
                border-radius: 10px;
                font-size: 24px;
            }
            .reg {
                width: 180px;
                height: 100px;
                border-radius: 10px;
                margin-left: 100px;
                font-size: 24px;
            }
        }
    }
}
</style>
