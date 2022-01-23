<template>
    <div class="flex">
        <icon-close-circle class="icon-close-circle" @click.self="close" />
        <input
            type="text"
            v-model="content"
            class="content"
            @change="updateTaskProperty($event, 'name')"
            @keyup.enter="updateTaskProperty($event, 'name')"
        />
        <span>描述：</span>
        <textarea
            class="text"
            v-model="task.description"
            @change="updateTaskProperty($event, 'description')"
        ></textarea>
    </div>
</template>

<script lang="ts">
import { IconCloseCircle } from '@arco-design/web-vue/es/icon';
import { useRoute ,useRouter} from 'vue-router'
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import debouceRef from '../../hooks/debounce'
export default defineComponent({
    name: 'NewCardButton',
    components: {
        IconCloseCircle
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const task = computed(() => {
            return store.getters.getTask(route.params.id);
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
        return {
            task,
            updateTaskProperty,
            content,
            close
        }
    }
})
</script>

<style lang="scss" scoped>
.flex {
    height: 600px;
    width: 800px;
    background-color: rgb(244, 245, 247);
    padding: 10px;
    margin: 150px auto;
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
        color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }
    .icon-close-circle:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    .content {
        width: 650px;
        line-height: 50px;
        border-radius: 10px;
        outline: 0;
        background-color: transparent;
        border: none;
        border-color: transparent;
        color: rgb(23, 43, 77);
        padding: 20px;
        font-size: 30px;
        margin-bottom: 10px;
    }
    span {
        font-size: 35px;
        margin-bottom: 20px;
        margin-left: 20px;
    }
    .text {
        margin-left: 20px;
        width: 600px;
    }
}
</style>