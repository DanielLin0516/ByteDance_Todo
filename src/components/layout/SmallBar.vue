<template>
  <div class="small-bar">
    <!-- 第二个菜单栏 -->
    <div class="second-bar">
      <span class="product-name">{{ productName }}</span>
      <div class="inviteUser" v-show="showInviteButton">
        <icon-user class="icon-user" />
        <div>邀请朋友</div>
      </div>
      <div class="change" @click="changeTheme($event)">切换夜间模式</div>
    </div>
  </div>
</template>

<script lang="ts">
import { IconUser, IconMoonFill } from "@arco-design/web-vue/es/icon";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { setTheme } from "@/theme/theme";
export default defineComponent({
  name: "SmallBar",
  components: {
    IconUser,
    IconMoonFill,
  },
  setup() {
    const isDark = ref(false);
    const store = useStore();
    const showInviteButton = computed(() => {
      return store.state.showInviteButton;
    });
    const productName = computed(() => {
      return store.state.currentProductName;
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
    return { changeTheme, store, showInviteButton, productName };
  },
});
</script>

<style lang="less" scoped>
@import url("../card/scrollCss/scroll.scss");
.small-bar {
  position: relative;
  display: flex;
  width: 100%;
  height: 7%;
  opacity: 1;
  flex-direction: column;
  overflow-y: hidden;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow-x: visible;
  .second-bar {
    display: flex;
    height: 80px;
    align-items: center;
    padding-left: 15px;
    .product-name {
      font-size: 24px;
      margin-left: 20px;
      font-family: PingFang-Regular;
      color: #fff;
      font-weight: 700;
    }
    .inviteUser {
      margin-left: 30px;
      color: #fff;
      background-color: rgba(@cardColorMain, 0.3);
      padding: 10px 15px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      .icon-user {
        width: 26px;
        height: 26px;
        color: #fff;
      }
    }
    .inviteUser:hover {
      background-color: rgba(@cardColorMain, 0.5);
    }
    .change {
      margin-left: 30px;
      color: rgba(@cardTextColorMain, 1);
      background-color: rgba(@cardColorMain, 1);
      padding: 10px 15px;
      border-radius: 10px;
      cursor: pointer;
      .icon-moon-fill {
        margin-right: 10px;
        width: 26px;
        height: 26px;
        color: rgba(@cardTextColorMain, 1);
      }
      .changr-text {
        color: rgba(@cardTextColorMain, 1);
      }
      .changr-text:hover {
        color: rgba(@cardColorMain, 1);
      }
    }
    .change:hover {
      background-color: rgba(@cardTextColorMain, 1);
      color: rgba(@cardColorMain, 1);
      .icon-moon-fill {
        color: rgba(@cardColorMain, 1);
      }
    }
  }
}
</style>
