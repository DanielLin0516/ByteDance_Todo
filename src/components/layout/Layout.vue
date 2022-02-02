<template>
  <TopBar></TopBar>
  <router-view></router-view>
  <!-- 抽屉 -->
</template>

<script lang="ts">
import TopBar from "@/components/layout/TopBar.vue";
import LeftDrawer from "./LeftDrawer.vue";
import MainCard from "../card/MainCard.vue";
import SmallBar from "@/components/layout/SmallBar.vue";
import { IconUser, IconMoonFill } from "@arco-design/web-vue/es/icon";
import { defineComponent, ref } from "vue";
import { setTheme } from "../../theme/theme";
import { currentUser } from '../../axios/api'
import store from "@/store";
export default defineComponent({
  name: "Layout",
  components: {
    IconUser,
    IconMoonFill,
    TopBar,
    MainCard,
    LeftDrawer,
    SmallBar,
  },
  setup() {
    const isDark = ref(false);
    console.log("layout")
    currentUser().then(res => {
      store.commit('USER_ID', res.userId);
    });

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
    return { changeTheme };
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