<template>
  <LeftDrawer></LeftDrawer>
  <div class="main-area">
    <div class="right">
      <SmallBar></SmallBar>
      <div class="right_down">
        <div class="container">
          <div class="loading" v-if="productLoading">
            <a-spin dot :loading="productLoading" size="25" />
          </div>
          <div v-else>
            <MainCard :lists="lists"></MainCard>
          </div>
        </div>
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
import { getProductInfo, owner } from "../../axios/api";
import { useStore } from "vuex";
import { Message } from "@arco-design/web-vue";
import { useRequest } from "@/hooks/useRequest";

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
    let cardList:Array<{}> = reactive([]);
    let lists:Array<{}> = reactive([]);
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
    const {
      data,
      loading: productLoading,
      error,
      run,
    } = useRequest(getProductInfo, {
      onError: () => {
        console.trace(error);
      },
    });
    //获取页面渲染数据与处理数据
    async function getInfo() {
      try {
        const res = await run(productId.value);
        // let res = await getProductInfo(productId.value);
        const showInvite = await owner(productId.value);
        Message.success({ content: "获取页面成功！" });
        store.commit("setShowInviteButton", showInvite.isOwner);
        res.cardList.forEach((item) => cardList.push(item));
        res.lists.forEach((item) => lists.push(item));
        lists.forEach((item: any) => {
          item.items = [];
        });
        cardList.forEach((item: any) => {
          lists.forEach((item1: any) => {
            if (item.listId === item1.id) {
              item1.items.push(item);
            }
          });
        });
      } catch (error) {
        console.trace(error);
      }
    }
    getInfo();
    return { changeTheme, getInfo, productLoading, lists };
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
      display: flex;
      justify-content: center;
      .container {
        width: 97%;
        display: flex;
        // position: relative;
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: inherit;
        }
      }
    }
  }
}
</style>
