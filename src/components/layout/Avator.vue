<template>
    <a-space :size="32">
        <a-avatar-group>
            <a-avatar
                :style="{ backgroundColor: '#7BC616' }"
                v-for="member of store.state.memberList"
                :key="member.id"
                v-show="store.state.memberList"
            >
                {{ member.firstName }}
                <!-- <p class="detail" v-show="show">{{ member.fullname }}</p> -->
            </a-avatar>

            <!-- <a-avatar :style="{ backgroundColor: '#14C9C9' }">B</a-avatar>
            <a-avatar :style="{ backgroundColor: '#168CFF' }">C</a-avatar>
            <a-avatar :style="{ backgroundColor: '#FF7D00' }">A</a-avatar>
            <a-avatar :style="{ backgroundColor: '#FFC72E' }">D</a-avatar>-->
        </a-avatar-group>
    </a-space>
</template>
<script lang="ts">
import { defineComponent, computed, watch, ref, onUpdated, onBeforeUnmount, onUnmounted, onBeforeUpdate, onMounted, onBeforeMount, nextTick } from 'vue';
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
    name: 'TopBar',
    components: {
    },
    setup(props) {
        const store = useStore();
        let member = store.state.memberList;
        let show = ref(false);
        onMounted(() => {
        member.forEach((item: any) => {
            item.firstName = ""
            item.firstName = item.fullname.slice(0, 1)
        })
        })

        return {
            store,

        }
    }
})

</script>

<style lang="less" scoped>
.detail {
    position: absolute;
    top: -20px;
    right: -20px;
    height: 30px;
    width: 60px;
    background-color: white;
    color: black;
}
</style>
