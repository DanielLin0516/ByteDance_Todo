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
import { defineComponent, ref, computed, reactive } from "vue";
import { setTheme } from "../../theme/theme";
import { getProductInfo, owner } from '../../axios/api';
import { useStore } from "vuex";
import { Message } from "@arco-design/web-vue";
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
    //获取页面渲染数据与处理数据
    async function getInfo() {
      try {
        let res = await getProductInfo(store.state.productId);
        let showInvite = await owner(store.state.productId);
        Message.success({ content: "获取页面成功！" })
        store.state.showInviteButton = showInvite.isOwner
        console.log(store.state.showInviteButton)
        
        store.state.cardList = res.cardList;
        store.state.lists = res.lists;
        store.state.lists.forEach((item: any) => {
          item.items = [];
        })
        store.state.cardList.forEach((item: any) => {
          store.state.lists.forEach((item1: any) => {
            if (item.listId === item1.id) {
              item1.items.push(item);
            }
          })
        })
      } catch (error) {

      }

    }
    getInfo();
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