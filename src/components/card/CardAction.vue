<template>
    <div class="addFile-container">
        <header class="addFile-header">
            <div>
                <icon-link :style="{ fontSize: '1em', margin: '0 10px 0 0' }" class="icon-link" />
                <span class="mySpan">活动</span>
            </div>
            <div class="header-button">
                <a-button @click="changeActionListIsShow($event)">隐藏详情</a-button>
            </div>
        </header>
        <main>
            <div>
                <a-avatar :style="{ backgroundColor: '#3370ff', float: 'left' }">
                    <IconUser />
                </a-avatar>
                <a-input
                    :style="{margin: '5px 10px 0 10px' }"
                    placeholder="添加评论..."
                    allow-clear
                    v-model="curComment"
                    class="input"
                />
            </div>
            <div class="main-action-item"></div>
        </main>
        <div class="actionList" v-if="isShowActionList">
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
                        <div class="action-timer">{{ action.actionTime }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IconLink, IconUser } from '@arco-design/web-vue/es/icon';
import { log } from 'console';
import { reactive, ref, defineComponent } from 'vue';
export default defineComponent({
    components: {
        IconLink, IconUser
    },
    props: {
        task: Object
    },
    setup(props) {
        let isShowActionList = ref(true)
        let curComment = ref('')
        const actions = []
        const createAction = {
            username:props.task.creator.fullname,
            actionTime:props.task.createdTime,
            action:'创建了该任务'
        }
        actions.push(createAction)
        
        const changeActionListIsShow = (e: any) => {
            if (e.target.innerHTML == '<!--v-if-->隐藏详情') {
                e.target.innerHTML = '<!--v-if-->查看详情'
            } else {
                e.target.innerHTML = '<!--v-if-->隐藏详情'
            }
            isShowActionList.value = !isShowActionList.value
        }
        return { actions, isShowActionList, curComment, changeActionListIsShow }
    }
})
</script>

<style scoped lang="less">
.addFile-container {
    margin: 30px 10px;
    width: 760px;
}
.addFile-header {
    font-size: 30px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    .icon-link {
        color: rgba(@cardTextColorMain, 0.8);
    }
}
.header-button {
    margin-right: 10px;
}
.mySpan {
    color: rgba(@cardTextColorMain, 0.8);
}
main {
    margin: 15px auto;
    .input {
        background: rgba(@cardColorMain, 1);
        color: rgba(@cardTextColorMain, 1);
        width: 450px !important;
    }
}
.actionItem {
    display: flex;
    align-items: center;
}
.action {
    width: 500px;
    height: 40px;
    margin: 15px;
    .action-header {
        display: flex;
        margin-bottom: 3px;
    }
    .action-username {
        margin: 0 5px;
        font-weight: 700;
        display: block;
    }
    .action-timer {
        color: rgba(@cardTextColorSub, 1);
    }
}
</style>