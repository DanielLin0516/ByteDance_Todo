<template>
    <div class="flex">
        <icon-close-circle class="icon-close-circle" @click.self="close" />
        <div class="header">
            <icon-robot :style="{ fontSize: '1.2em', margin: '0 10px' }" class="robot" />
            <input
                type="text"
                v-model="content"
                class="content"
                @change="updateTaskProperty($event, 'name')"
                @keyup.enter="updateTaskProperty($event, 'name')"
            />
            <div class="listName">
                在列表
                <span class="listNameSpan">{{ listName }}</span>中
            </div>
        </div>
        <div :class="date" v-if="task.time.timePeriod">
            <span>日期</span>
            <div>{{ task.time.timePeriod[0] }} - {{ task.time.timePeriod[1] }}</div>
        </div>
        <div class="des">
            <icon-align-left class="icon-left" :style="{ fontSize: '1.2em', margin: '0 10px' }" />
            <span>描述</span>
        </div>
        <a-textarea
            default-value="添加详细描述..."
            class="text"
            v-model="task.description"
            placeholder="添加详细描述..."
            @change="updateTaskProperty($event, 'description')"
            :auto-size="{ minRows: 2, maxRows: 5 }"
        />
        <card-action :task="task"></card-action>
        <card-detail-fuction></card-detail-fuction>
    </div>
</template>
<script lang="ts">
import { IconCloseCircle, IconRobot, IconAlignLeft } from '@arco-design/web-vue/es/icon';
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import debouceRef from '../../hooks/debounce'
import CardAction from './CardAction.vue'
import CardDetailFuction from './CardDetailFuction.vue'
export default defineComponent({
    name: 'NewCardButton',
    components: {
        IconCloseCircle,
        IconRobot,
        IconAlignLeft,
        CardAction,
        CardDetailFuction
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const task = computed(() => {
            return store.getters.getTask(route.params.id);
        })
        const listName = computed(() => {
            return store.getters.getColumnName(route.params.cid)
        })
        const content = computed({
            get() {
                let task1 = store.getters.getTask(route.params.id);
                return task1.content;
            },
            set(val) {
                let task1 = store.getters.getTask(route.params.id);
                return task1.content = val;
            }
        })
        let debounce = debouceRef(content.value);
        const updateTaskProperty = (e: { target: any; }, key: any) => {
            store.commit('UPDATE_TASK', {
                task,
                key,
                value: e.target
            })
        }
        const close = () => {
            router.push({ name: 'board' });
        }
        const date = computed(() => {
            return {
                'date': true,
                
            }
        })
        return {
            task,
            listName,
            content,
            updateTaskProperty,
            close,
            date
        }
    }
})
</script>

<style lang="less" scoped>
.flex {
    height: 750px;
    border-radius: 10px;
    width: 800px;
    background-color: rgba(@cardColorMain, 1);
    padding: 10px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    .icon-close-circle {
        position: absolute;
        right: 20px;
        top: 20px;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        padding: 10px;
        color: rgba(@cardTextColorMain, 0.5);
        cursor: pointer;
    }
    .icon-close-circle:hover {
        background-color: rgba(@cardTextColorMain, 0.1);
    }
    .header {
        // display: flex;
        align-items: center;
        margin-bottom: 30px;
        .robot {
            height: 30px;
            width: 30px;
        }
        .content {
            width: 650px;
            line-height: 30px;
            border-radius: 10px;
            outline: 0;
            background-color: transparent;
            border: none;
            border-color: transparent;
            color: rgba(@cardTextColorMain, 0.8);
            padding: 20px;
            padding-bottom: 10px;
            font-size: 30px;
            // margin-bottom: 10px;
            margin-left: -20px;
        }
        .listName {
            margin-left: 60px;
            text-align: left;
            color: rgba(@cardTextColorMain, 0.8);
        }
        .listNameSpan {
            margin: 0 5px;
            text-decoration: underline;
        }
    }
    .date {
        span {
            display: inline-block;
            margin-left: 20px;
            font-size: 18px;
            font-weight: 500;
            color: rgba(@cardTextColorMain, 0.7);
            margin-bottom: 10px;
        }
        div {
            padding: 10px;
            margin-left: 10px;
            margin-bottom: 10px;
            border-radius: 10px;
        }
        div:hover {
            background-color: rgba(@cardTextColorMain, 0.1);
        }
    }
    .des {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        font-weight: 700;
        span {
            font-size: 30px;
            text-align: left;
        }
        .icon-left {
            width: 30px;
            height: 30px;
        }
    }
    .text {
        border: none;
        outline: 0;
        background-color: transparent;
        margin-left: 40px;
        width: 600px;
        color: rgba(@cardTextColorSub, 1);
        font-size: 20px;
    }
    .text:hover {
        background-color: rgba(@cardColorWrapper, 0.8);
    }
}
</style>