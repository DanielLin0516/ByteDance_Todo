<template>
    <div class="small-bar">
        <div class="second-bar">
            <span>项目名称</span>
            <div class="user">
                <icon-user class="icon-user" />邀请朋友
            </div>
            <div class="change">
                <icon-moon-fill class="icon-moon-fill" />切换夜间模式
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IconUser, IconMoonFill } from '@arco-design/web-vue/es/icon';
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'SmallBar',
    components: {
        IconUser,
        IconMoonFill
    }
})
</script>

<style lang="scss" scoped>
.small-bar {
    display: flex;
    height: calc(100% - 80px);
    opacity: 1;
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
            background-color:white;
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            .icon-moon-fill {
                margin-right: 10px;
                width: 26px;
                height: 26px;
                color: black;
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