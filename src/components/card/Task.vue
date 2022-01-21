<template>
    <div class="flex">
        <input
            type="text"
            v-model="task.content"
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
import { useRoute } from 'vue-router'
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
    name: 'NewCardButton',
    components: {
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const task = computed(() => {
            return store.getters.getTask(route.params.id);
        })
        const updateTaskProperty = (e: { target: any; }, key: any) => {
            store.commit('UPDATE_TASK', {
                task,
                key,
                value: e.target
            })
        }
        return {
            task,
            updateTaskProperty
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
    .content {
        width: 700px;
        line-height: 50px;
        border-radius: 10px;
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