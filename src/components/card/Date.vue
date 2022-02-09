<template>
    <div class="date">
        <div class="header">
            <span>日期</span>
            <icon-close-circle
                class="icon-close"
                @click.self="store.state.show = !store.state.show"
            />
        </div>
        <span>请选择任务开始和结束时间</span>
        <a-range-picker
            show-time
            :time-picker-props="{ defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('00:00:00', 'HH:mm:ss')] }"
            format="YYYY-MM-DD HH:mm"
            @ok="onOk"
            class="range"
        />
        <a-button type="primary" class="save" @click.self="save">保存</a-button>
        <a-button type="primary" class="delete" @click.self="del">移除</a-button>
    </div>
</template>
<script lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { IconCloseCircle } from '@arco-design/web-vue/es/icon';
import { defineComponent, computed, ref, inject, reactive, provide } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { setTime } from '@/axios/api'
import { Message } from '@arco-design/web-vue';
export default defineComponent({
    components: {
        IconCloseCircle
    },
    props: {
        lists: Object
    },
    setup(props, context) {
        dayjs.extend(utc);
        const store = useStore();
        let time = ref(null);
        let cardId: any = inject('cardId');
        const route = useRoute();
        let lists = props.lists;
        let obj = reactive({
            beginTime: "",
            deadline: "",
            dueReinder: 0
        })
        function onOk(dateString: string, date: string) {
            obj.beginTime = dayjs(dateString[0]).utc().format();
            obj.deadline = dayjs(dateString[1]).utc().format();
        }
        async function save() {
            context.emit('time', obj);
            lists?.forEach((item: any) => {
                item.items.forEach((item1: any) => {
                    if (cardId === item1.cardId) {
                        item1.begintime = obj.beginTime;
                        item1.deadline = obj.deadline;
                    }
                })
            })
            await setTime(cardId, obj);
            Message.success({ content: "设置成功" })
            store.state.show = !store.state.show;
        }
        async function del() {
            obj.beginTime = "";
            obj.deadline = "";
            context.emit('time', obj);
            lists?.forEach((item: any) => {
                item.items.forEach((item1: any) => {
                    if (cardId === item1.cardId) {
                        item1.begintime = "";
                        item1.deadline = "";
                    }
                })
            })
            await setTime(cardId, obj);
            store.state.show = !store.state.show;
        }
        return {
            onOk,
            dayjs,
            store,
            save,
            del
        };
    }
})
</script>

<style lang="less" scoped>
.date {
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 400px;
    padding: 20px;
    position: absolute;
    border-radius: 5px;
    top: 0px;
    right: -200px;
    background-color: rgba(@cardColorMain, 1);
    border-left: 1px solid rgba(@cardTextColorMain, 0.3);
    box-shadow: 0 8px 16px -4px rgb(9 30 66 / 25%), 0 0 0 1px rgb(9 30 66 / 8%);
    z-index: 9999;
    .header {
        display: flex;
        height: 80px;
        width: 100%;
        align-items: center;
        justify-content: center;
        position: relative;
        border-bottom: 1px solid rgba(@cardTextColorMain, 1);
        margin-bottom: 30px;
        .icon-close {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            padding: 10px;
            color: rgba(@cardTextColorMain, 0.5);
            cursor: pointer;
            position: absolute;
            right: 0px;
            top: 0px;
        }
        .icon-close:hover {
            background-color: rgba(@cardTextColorMain, 0.1);
        }
    }
    span {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
    }
    .range {
        width: 360px;
        margin: 0 24px 24px 0;
    }
    .save {
        margin-top: 20px;
        width: 150px;
        height: 50px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    .delete {
        width: 150px;
        height: 50px;
        border-radius: 5px;
    }
    :deep(span.arco-panel-date-view-tab-pane-text) {
        margin-left: 2px;
    }
}
</style>