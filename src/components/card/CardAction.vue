<template>
    <div class="addFile-container">
        <header class="addFile-header">
            <div>
                <icon-link :style="{ fontSize: '1em', margin: '0 10px 0 0' }" />
                <span class="desc-title">活动</span>
            </div>
            <div class="header-button">
                <a-button>隐藏详情</a-button>
            </div>
        </header>
        <main>
            <div class="main-input-wrapper">
                <a-avatar :style="{ backgroundColor: '#3370ff', float: 'left' }">
                    <IconUser />
                </a-avatar>
                <a-input
                    :style="{ width: '320px', background: '#fff', margin: '5px 10px 0 10px' }"
                    placeholder="添加评论..."
                    allow-clear
                />
            </div>
            <div class="main-action-item"></div>
        </main>
        <div v-for=" (action, $actionIndex) of actions" :key="$actionIndex">
            <div class="actionItem">
                <a-avatar :style="{ backgroundColor: '#3370ff', float: 'left' }">
                    <IconUser />
                </a-avatar>
                <div class="action">
                    <div class="action-header">
                        <span class="action-username">{{ action.username }}</span>
                        {{ action.action }}
                    </div>
                    <div action-timer>{{ action.actionTime }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IconLink, IconUser } from '@arco-design/web-vue/es/icon';
import { defineComponent } from 'vue';
import { reactive, ref } from '@vue/reactivity';
export default defineComponent({
    components: {
        IconLink, IconUser
    },
    props: {
        task: Object
    },
    setup(props: any) {
        const actions = props.task ? props.task.actions : {}
        let username = ref('临时用户')
        let action = ref('把任务移动了')
        let actionTime = ref('1月20日21:21:20')
        return {
            username,
            action,
            actionTime,
            actions
        }
    }
})
</script>

<style scoped lang="scss">
.addFile-container {
    margin: 30px 10px;
}
.addFile-header {
    font-size: 30px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
}
.header-button {
    margin-right: 10px;
}
main {
    margin: 15px auto;
}
.actionItem {
    display: flex;
    align-items: center;
}
.action {
    width: 320px;
    height: 40px;
    margin: 15px;
    .action-header {
        display: flex;
        margin-bottom: 3px;
    }
    .action-username {
        font-weight: 700;
        display: block;
    }
    .action-timer {
        color: rgb(112, 109, 109);
    }
}
</style>