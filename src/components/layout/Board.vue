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

      <div class="right_down">
        <div v-show="!loading">
          <MainCard @loadingOver="loadingOver"></MainCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LeftDrawer from "@/components/layout/LeftDrawer.vue";
import MainCard from "../card/MainCard.vue";
import SmallBar from "@/components/layout/SmallBar.vue";
import { defineComponent, ref, computed, reactive } from "vue";
import { setTheme } from "@/theme/theme";
import { useStore } from "vuex";
export default defineComponent({
  name: "Board",
  components: {
    MainCard,
    LeftDrawer,
    SmallBar,
  },
  setup() {
    const isDark = ref(false);
    const loading = ref(true);
    const store = useStore();
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
    const loadingOver = () => {
      loading.value = false;
    };
    return { changeTheme, loading, loadingOver };
  },
});
</script>

<style lang="less" scoped>
@import url("../card/scrollCss/scroll.scss");
.main-area {
  position: relative;
  display: flex;
  .right {
    position: relative;
    height: calc(100vh - 80px);
    width: 100%;
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