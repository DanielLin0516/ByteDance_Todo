<template>
    <div class="top-bar">
        <div class="left-bar">
            <icon-bytedance-color class="icon-byte" />
            <span class="link">项目</span>
        </div>
        <div class="right-bar">
            <card-detail />
            <a-input-search placeholder="Please enter something" class="input" />
            <icon-notification class="notifacte" @click="show = !show" />
            <div class="changeEvent" v-if="show">
                <a-empty v-if="store.state.userEvent.length === 0" />
                <div
                    class="event"
                    v-for="event in store.state.userEvent"
                    :key="event.id"
                >{{ event.content }}发生改变，请查收
                </div>
            </div>
            <a-avatar :style="{ backgroundColor: '#3370ff' }" class="avatar">
                <IconUser />
            </a-avatar>
        </div>
    </div>
</template>
<script lang="ts">
import { IconBytedanceColor, IconNotification, IconUser } from '@arco-design/web-vue/es/icon';
import { defineComponent, computed, watch, ref } from 'vue';
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default defineComponent({
    name: 'TopBar',
    components: {
        IconBytedanceColor,
        IconNotification,
        IconUser,
    },
    setup(props) {
        const store = useStore();
        const route = useRoute();
        const task = computed(() => {
            return store.getters.getTask(route.params.id);
        })
        const show = ref(false)
        watch(task, (newVal, oldVal) => {
            if (oldVal && newVal) {
                store.state.userEvent.unshift({
                    content: newVal.content,
                    id: newVal.id
                })
            }
        }, { deep: true });
        watch(store.state.board.columns, (newVal, oldVal) => {
            console.log(newVal, oldVal)
        }, { deep: true })
        return {
            show,
            store
        }
    }
})

</script>

<style lang="scss" scoped>
@import "../card/scrollCss/scroll.scss";
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
            position: relative;
        }
        .changeEvent {
            overflow-x: hidden;
            overflow-y: visible;
            position: absolute;
            right: 10px;
            top: 85px;
            width: 700px;
            min-height: 100px;
            max-height: 700px;
            border-radius: 10px;
            background-color: rgb(252, 246, 246);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            transition: all 0.5s ease-in-out;
            .event {
                font-size: 20px;
                padding: 10px;
                flex-shrink: 0;
                width: 700px;
                height: 50px;
                background-color: rgba(247, 165, 165, 0.2);
                border-radius: 10px;
                margin-top: 10px;
                margin-bottom: 10px;
                display: flex;
            }
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
