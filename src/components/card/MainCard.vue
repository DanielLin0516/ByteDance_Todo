<template>
    <div class="card-wrapper">
        <!-- 要渲染的卡片 -->
        <div
            class="card-item"
            v-for="(column,$columnIndex) of store.state.board.columns"
            :key="$columnIndex"
            draggable="true"
            @drop="moveTaskOrColumn($event, column.items, $columnIndex, undefined)"
            @dragover.prevent
            @dragenter.prevent
            @dragstart.self="pickupColumn($event, $columnIndex)"
        >
            <!-- 卡片标题 -->
            <div class="card-title">{{ column.title }}</div>
            <!-- 卡片任务栏也要渲染 -->
            <!-- <transition-group
                name="animate__animated animate__bounce"
                enter-active-class="animate__backInLeft"
                leave-active-class="animate__backOutUp"
                appear
            > -->
                <div
                    v-for=" (task,$taskIndex) of column.items"
                    :key="$taskIndex"
                    @click="goToTask(task)"
                    draggable="true"
                    @dragstart="pickupTask($event, $taskIndex, $columnIndex)"
                    @dragover.prevent
                    @dragenter.prevent
                    @drop.stop="moveTaskOrColumn($event, column.items, $columnIndex, $taskIndex)"
                >
                    <div class="card-menu">
                        {{ task.content }}
                        <div class="des">{{ task.description }}</div>
                    </div>
                    <div
                        class="kanban-dropzon"
                        @dragover.prevent="height($event)"
                        @dragleave.prevent="height1($event)"
                        @drop="height1($event)"
                    ></div>
                </div>
            <!-- </transition-group> -->
            <!-- 添加卡片按钮 -->
            <input
                class="new-button"
                type="text"
                placeholder="+ 添加任务"
                @keyup.enter="createTask(($event), column.items)"
            />
        </div>
        <div class="btn-add">
            <input
                class="add-item"
                type="text"
                v-model="newColumnName"
                placeholder="添加另一个列表"
                @keyup.enter="createColumn"
            />
        </div>

        <div class="task-bg" v-if="isTaskOpen" @click.self="close">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import 'animate.css'
import { IconPlus } from '@arco-design/web-vue/es/icon';
import { computed, defineComponent, ref, TransitionGroup } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
    name: 'MainCard',
    components: {
        IconPlus,
        TransitionGroup
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const newColumnName = ref('');
        const isTaskOpen = computed(() => {
            return route.name === 'task';
        })
        const goToTask = (task: { id: any; }) => {
            router.push({ name: 'task', params: { id: task.id } });
        }
        const close = () => {
            router.push({ name: 'board' });
        }
        const createTask = (e: any, tasks: any) => {
            store.commit('CREATE_TASK', {
                tasks,
                content: e.target.value
            })
            e.target.value = '';
        }
        const createColumn = () => {
            store.commit('CREATE_COLUMN', {
                title: newColumnName.value
            })
            newColumnName.value = '';
        }
        const pickupTask = (e: any, taskIndex: any, fromColumnIndex: any) => {
            e.dataTransfer.effctAllowed = 'move';
            e.dataTransfer.dropEffect = 'move';
            e.dataTransfer.setData('from-task-index', taskIndex);
            e.dataTransfer.setData('from-column-index', fromColumnIndex);
            e.dataTransfer.setData('type', 'task');
        }
        const pickupColumn = (e: any, fromColumnIndex: any) => {
            e.dataTransfer.effctAllowed = 'move';
            e.dataTransfer.dropEffect = 'move';
            e.dataTransfer.setData('from-column-index', fromColumnIndex);
            e.dataTransfer.setData('type', 'column');
        }
        const moveTaskOrColumn = (e: any, toTasks: any, toColumnIndex: any, toTaskIndex: any) => {
            const type = e.dataTransfer.getData('type')
            if (type === 'task') {
                moveTask(e, toTasks, toTaskIndex !== 'undefined' ? toTaskIndex : toTasks.length);
            } else {
                moveColumn(e, toColumnIndex);
            }
        }
        const moveTask = (e: any, toTasks: any, toTaskIndex?: any) => {
            const fromColumnIndex = e.dataTransfer.getData('from-column-index');
            const fromTasks = store.state.board.columns[fromColumnIndex].items;
            const fromTaskIndex = e.dataTransfer.getData('from-task-index')
            store.commit('MOVE_TASK', {
                fromTasks,
                fromTaskIndex,
                toTasks,
                toTaskIndex
            })
        }
        const moveColumn = (e: { dataTransfer: { getData: (arg0: string) => any; }; }, toColumnIndex: any) => {
            const fromColumnIndex = e.dataTransfer.getData('from-column-index')
            store.commit('MOVE_COLUMN', {
                fromColumnIndex,
                toColumnIndex
            })
        }
        const height = (e: any) => {
            e.target.style.height = "80px";
            e.target.style.border = "1px solid grey"
        }
        const height1 = (e: any) => {
            e.target.style.height = "10px";
            e.target.style.border = ""
        }
        return {
            store,
            isTaskOpen,
            goToTask,
            close,
            createTask,
            pickupTask,
            moveTask,
            pickupColumn,
            moveTaskOrColumn,
            newColumnName,
            createColumn,
            height,
            height1
        }
    }
})
</script>
<style lang="scss" scoped>
@import url("./scrollCss/scroll.scss");
.card-wrapper {
    width: max-content;
    height: auto;
    .card-item {
        overflow-x: hidden;
        overflow-y: visible;
        max-height: 640px;
        width: 380px;
        float: left !important;
        flex-direction: column;
        // flex-shrink: 0;
        display: flex;
        margin-top: 5px;
        margin-left: 20px;
        margin-right: 20px;
        background-color: rgb(235, 236, 240);
        border-radius: 10px;
        cursor: pointer;
        padding: 30px 20px 20px 20px;
        .card-title {
            cursor: pointer;
            width: 350px;
            height: 30px;
            opacity: 1;
            padding: 10px;
            font-size: 24px;
            font-family: PingFang-Bold-2;
        }
        .card-menu {
            height: auto;
            width: 350px;
            background-color: white;
            padding: 10px;
            margin-top: 10px;
            margin-bottom: 10px;
            border-radius: 10px;
            box-shadow: 4px 2px 2px 1px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            font-size: 24px;
            border-bottom: 2px solid rgba(117, 116, 116, 0.45);
            .des {
                font-size: 16px;
                color: grey;
                margin-top: 5px;
                font-style: italic;
            }
        }
        .card-menu:hover {
            background-color: rgba(255, 255, 255, 0.45);
        }
        .kanban-dropzon {
            height: 10px;
            background-color: transparent;
            border-radius: 10px;
        }
    }

    .new-button {
        background-color: transparent;
        border: none;
        outline: 0;
        height: 30px;
        width: 350px;
        cursor: pointer;
        font-size: 24px;
        border-radius: 10px;
        padding: 10px;
    }
    .new-button:hover {
        background-color: rgba(255, 250, 250, 0.4);
    }

    .task-bg {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        background-color: rgba(7, 7, 7, 0.45);
    }
    .btn-add {
        float: left;
        .add-item {
            cursor: pointer;
            height: 50px;
            font-size: 24px;
            border-radius: 10px;
            padding: 10px;
            display: flex;
            align-items: center;
            width: 380px;
            background-color: rgba(236, 219, 219, 0.44);
            // color: white;
            margin-top: 5px;
            border: none;
            outline: 0;
        }
        .add-item:hover {
            background-color: rgba(255, 250, 250, 0.4);
        }
    }
}
</style>