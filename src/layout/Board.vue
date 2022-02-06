<template>
  <LeftDrawer></LeftDrawer>
  <div class="main-area">
    <div class="right">
      <div class="loading" v-show="loading">
        <a-spin dot :loading="loading" :size="25" />
      </div>
      <div v-show="!loading">
        <SmallBar></SmallBar>
      </div>
      <div class="right_down" v-show="!loading">
        <MainCard @loadingOver="loadingOver"></MainCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LeftDrawer from "@/layout/LeftDrawer.vue";
import MainCard from "@/components/card/MainCard.vue";
import SmallBar from "@/layout/SmallBar.vue";
import {
  defineComponent,
  ref,
} from "vue";
import { useStore } from "vuex";
import { setTheme } from "@/theme/theme";
export default defineComponent({
  name: "Board",
  components: {
    MainCard,
    LeftDrawer,
    SmallBar,
  },
  setup() {
    const store = useStore();
    const isDark = ref(false);
    const loading = ref(true);
    let projectColor = ref("");
    const changeTheme = (e: any) => {
      if (!isDark.value) {
        e.currentTarget.innerText = "切换默认模式";
        setTheme("dark");
      } else {
        e.currentTarget.innerText = "切换夜间模式";
        setTheme("default");
      }
      isDark.value = !isDark.value;
    };
    // 加载完成,子组件加载完成调用
    const loadingOver = (bgcColor: string) => {
      projectColor.value = bgcColor;
      loading.value = false;
    };
    return { changeTheme, loading, loadingOver, projectColor };
  },
});
</script>

<style lang="less" scoped>
@import url("@/components/card/scrollCss/scroll.scss");
.main-area {
  position: relative;
  display: flex;
  z-index:1;
  .right {
    position: relative;
    height: calc(100vh - 80px);
    width: 100%;
      z-index:-1;
    .loading {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: inherit;
    }
    .right_down {
      position: relative;
      width: 100%;
      // height: 90%;
      height: calc(100vh - 180px);
      overflow-x: visible;
      overflow-y: hidden;
    }
  }
}
</style>