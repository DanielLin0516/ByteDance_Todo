<template>
  <TopBar></TopBar>
  <router-view></router-view>
  <!-- 抽屉 -->
</template>

<script lang="ts">
import TopBar from "@/layout/TopBar.vue";
import { defineComponent, ref, onMounted, computed, nextTick, provide } from "vue";
import { currentUser } from "@/axios/api";
import { useStore } from "vuex";
export default defineComponent({
  name: "Layout",
  components: {
    TopBar,
  },
  setup() {
    const store = useStore();
    let fullName:any = ref(null)
    const currentUserFunc = async () => {
      const res = await currentUser();
      store.commit("setCurrentUser",res);
    }
    currentUserFunc()
    return {fullName};
  },
});
</script>

<style lang="less" scoped>
@import url("@/components/card/scrollCss/scroll.scss");
.main-area {
  position: relative;
  display: flex;
  .right {
    position: relative;
    height: calc(100vh - 80px);
    width: 100%;

    .right_down {
      position: relative;
      width: 100%;
      height: 90%;
      overflow-x: visible;
      overflow-y: hidden;
    }
  }
}
</style>

