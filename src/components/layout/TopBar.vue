<template>
    <div class="top-bar">
        <div class="left-bar">
            <icon-bytedance-color class="icon-byte" />
            <span class="link">项目</span>
        </div>
        <div class="right-bar">
            <card-detail />
            <a-input-search placeholder="Please enter something" class="input" />
            <icon-notification class="notifacte" />
            <a-avatar :style="{ backgroundColor: '#3370ff' }" class="avatar">
                <IconUser />
            </a-avatar>
        </div>
    </div>
</template>
<script lang="ts">
import { IconBytedanceColor, IconNotification, IconUser } from '@arco-design/web-vue/es/icon';
import CardDetail from '../card/CardDetail.vue'
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'TopBar',
    components: {
        IconBytedanceColor,
        IconNotification,
        IconUser,
        CardDetail
    },
    setup(props) {
        console.log(999)
    }
})

</script>

<style lang="scss" scoped>
.top-bar {
    position: relative;
    display: flex;
    height: 80px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(10px);
    .left-bar {
        height: 100%;
        width: 50%;
        display: flex;
        align-items: center;
        .icon-byte {
            margin-left: 50px;
            width: 50px;
            height: 50px;
        }
        .link {
            margin-left: 50px;
            font-family: "PingFang-Regular";
            font-size: 24px;
            color: white;
            line-height: 20px;
            border-radius: 5px;
            padding: 20px;
            cursor: pointer;
            border: 1px solid white;
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .link:hover {
            background-color: rgba(0, 0, 0, 0.45);
        }
    }
    .right-bar {
        height: 100%;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .notifacte {
            width: 50px;
            height: 50px;
            color: white;
            margin-right: 35px;
            cursor: pointer;
        }
        .input {
            margin-right: 40px;
            width: 360px;
            height: 50px;
        }
        .avatar {
            margin-right: 35px;
            width: 50px;
            height: 50px;
        }
    }
}
</style>
