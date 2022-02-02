<template>
  <LeftDrawer></LeftDrawer>
  <div class="main-area">
    <div class="right">
      <SmallBar></SmallBar>
      <div class="right_down">
        <MainCard></MainCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LeftDrawer from "./LeftDrawer.vue";
import MainCard from "../card/MainCard.vue";
import SmallBar from "@/components/layout/SmallBar.vue";
import { useRoute, useRouter } from "vue-router";
import { defineComponent, ref, computed } from "vue";
import { setTheme } from "../../theme/theme";
import { getProductInfo } from '../../axios/api';
import { useStore } from "vuex";
export default defineComponent({
  name: "Layout",
  components: {
    MainCard,
    LeftDrawer,
    SmallBar,
  },
  setup() {
    const isDark = ref(false);
    const route = useRoute();
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
    const productId = computed(() => {
      return route.params.productId;
    });
    store.state.productId = productId;
     getProductInfo(store.state.productId).then(res => {
      console.log(res)
      store.state.cardList = res.cardList;
      store.state.lists = res.lists;
     },error => {
       console.log(error,'123')
     })

    return { changeTheme};
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