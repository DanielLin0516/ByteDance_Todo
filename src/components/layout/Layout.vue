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
import { defineComponent, ref, onMounted, computed, nextTick, provide } from "vue";
import { setTheme } from "../../theme/theme";
import { currentUser } from "../../axios/api";
import { useStore } from "vuex";
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
    const store = useStore();
    let fullName:any = ref(null)
    const currentUserFunc = async () => {
      const res = await currentUser();
      store.commit("setUserId", res.userId);
      store.commit("fullName",res.fullname)
      store.commit("Email",res.username)
    }
    currentUserFunc()
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
    return { changeTheme ,fullName};
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
