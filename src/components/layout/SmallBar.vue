<template>
    <div class="small-bar">
        <!-- 第二个菜单栏 -->
        <div class="second-bar">
            <span>项目名称</span>
            <div class="user">
                <icon-user class="icon-user" />邀请朋友
            </div>
            <div class="change" @click="changeTheme($event)">
                切换夜间模式
            </div>
        </div>
        <!-- 主要的卡片区域 -->
        <router-view />
        <!-- <main-card/> -->
    </div>
</template>

<script lang="ts">
// import MainCard from '../card/MainCard.vue'
import { IconUser, IconMoonFill } from '@arco-design/web-vue/es/icon';
import { defineComponent, ref } from 'vue';
import { setTheme } from '../../theme/theme'
export default defineComponent({
    name: 'SmallBar',
    components: {
        IconUser,
        IconMoonFill
    },
    setup() {
        const isDark = ref(false)
        const changeTheme = (e:any) => {
            if(!isDark.value) {
                e.currentTarget.innerText = '切换默认模式'
                setTheme('dark')
            } else {
                e.currentTarget.innerText = '切换夜间模式'
                setTheme('default')
            }
            isDark.value = !isDark.value
        }
        return { changeTheme }
    }
})
</script>

<style lang="scss" scoped>
@import url('../card/scrollCss/scroll.scss');
.small-bar {
    display: flex;
    height: calc(100% - 80px);
    opacity: 1;
    flex-direction: column;
    overflow-y: hidden;
    overflow-x: visible;
    .second-bar {
        display: flex;
        width: 100%;
        height: 80px;
        align-items: center;
        span {
            font-size: 26px;
            margin-left: 20px;
            font-family: PingFang-Regular;
            color: rgba($color: #ffffff, $alpha: 0.9);
        }
        .user {
            margin-left: 30px;
            color: rgba($color: #ffffff, $alpha: 0.9);
            background-color: rgba(255, 255, 255, 0.3);
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            .icon-user {
                width: 26px;
                height: 26px;
                color: rgba($color: #ffffff, $alpha: 0.9);
            }
        }
        .user:hover {
            background-color: rgba(255, 255, 255, 0.5);
        }
        .change {
            margin-left: 30px;
            color: black;
            background-color: white;
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            .icon-moon-fill {
                margin-right: 10px;
                width: 26px;
                height: 26px;
                color: black;
            }
            .changr-text {
                color: black;
            }
            .changr-text:hover{
                color: white;
            }
        }
        .change:hover {
            background-color: black;
            color: white;
            .icon-moon-fill {
                color: white;
            }
        }
    }
}
</style>