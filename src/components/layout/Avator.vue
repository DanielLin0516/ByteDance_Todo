<template>
  <a-space :size="32">
    <a-avatar-group>
      <a-avatar
        :style="{ backgroundColor: '#7BC616' }"
        v-for="item of member"
        :key="item.userId"
        v-show="member.length != 0"
      >
        {{ item.fullname.slice(0, 1) }}
      </a-avatar>
    </a-avatar-group>
  </a-space>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ComputedRef } from "vue";
import { useStore } from "vuex";
import { UserElement } from "@/axios/globalInterface";
export default defineComponent({
  name: "TopBar",
  components: {},
  setup(props) {
    const store = useStore();

    const member: ComputedRef<UserElement[]> = computed(() => {
      return store.state.memberList;
    });

    return {
      store,
      member,
    };
  },
});
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
