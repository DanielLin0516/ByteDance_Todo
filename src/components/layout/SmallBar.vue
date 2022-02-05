<template>
  <div class="small-bar">
    <!-- 第二个菜单栏 -->
    <div class="second-bar">
      <span class="product-name" style="margin-right: 1vw;">{{ productName }}</span>
      <Avator></Avator>
      <div class="inviteUser" v-show="showInviteButton" @click="inviteShow">
        <icon-user class="icon-user" />
        <div>邀请朋友</div>
      </div>
      <div class="change" @click="changeTheme($event)">切换夜间模式</div>
    </div>
  </div>
  <div class="invite-code" v-show="inviteCard">
    <div class="invite-header">
      <span>邀请加入看版</span>
      <icon-close class="close" @click="inviteCard = !inviteCard" />
    </div>
    <div class="link">
      <div class="use-link">
        <icon-link class="link-icon" />
        <span>使用链接邀请</span>
      </div>
      <span class="create-link" @click="createLink">创建连接</span>
    </div>
    <div style="font-size: 1vw;color: rgb(rgb(131,140,145)); margin-bottom: 1vw;">具有该链接的任何人均可加入为看板成员</div>
    <a-spin size="20" v-if="loading" />
    <div style="width: 100%;display: flex;flex-direction: column;" v-show="inviteCodeData">
      <a-input style="width: 100%;margin-bottom: 0.5vw;" allow-clear :model-value="link" />
      <a-button type="primary" style="width: 6vw;height: 2vw;" @click="copy">复制链接</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { IconUser, IconMoonFill, IconClose, IconLink } from "@arco-design/web-vue/es/icon";
import { computed, defineComponent, ref, onBeforeUpdate } from "vue";
import Avator from '@/components/layout/Avator.vue'
import { useRoute } from 'vue-router'
import { useStore } from "vuex";
import { setTheme } from "@/theme/theme";
import { getInviteCode } from "@/axios/api"
import { useRequest } from "@/hooks/useRequest";
import { Message } from "@arco-design/web-vue";
export default defineComponent({
  name: "SmallBar",
  components: {
    IconUser,
    IconMoonFill,
    IconClose,
    IconLink,
    Avator
  },
  setup() {
    const isDark = ref(false);
    const store = useStore();
    const inviteCard = ref(false);
    let userId = ref(null)
    onBeforeUpdate(() => {
      userId = store.state.userId;
    })
    const route = useRoute();
    let inviteCodeData = ref(null);
    let link = ref(String(null));
    const productId = computed(() => {
      return route.params.productId;
    });
    const inviteShow = () => {
      inviteCard.value = !inviteCard.value
    }
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
    const { data, loading, error, run } = useRequest(getInviteCode, {
      onError: () => {
        console.trace(error);
      },
    });
    const createLink = async () => {
      const res = await run(userId);
      inviteCodeData.value = res;
      link.value = `http://localhost:3000/#/Invite/${productId.value}/${inviteCodeData.value}`
    }
    const copy = () => {
      // console.log('复制id', link.value)
      let eInput = document.createElement('input')
      eInput.value = link.value
      document.body.appendChild(eInput)
      eInput.select() //选择对象
      let copyText = document.execCommand('Copy') //执行浏览器的复制命令
      eInput.style.display = 'none'
      if (copyText) Message.success({ content: '复制成功' })
    }
    return {
      changeTheme,
      store,
      showInviteButton,
      productName,
      inviteCard,
      inviteShow,
      createLink,
      loading,
      inviteCodeData,
      link,
      copy
    };
  },
});
</script>

<style lang="less" scoped>
@import url("../card/scrollCss/scroll.scss");
.small-bar {
  position: relative;
  display: flex;
  width: 100%;
  height: 60px;
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
      position: relative;
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
.invite-code {
  height: 300px;
  width: 400px;
  background-color: rgb(255, 255, 255);
  position: absolute;
  left: 280px;
  top: 70px;
  z-index: 9999;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 8px 16px -4px #091e4240, 0 0 0 1px #091e4214;
  transition: all ease-in-out 0.5s;
  .invite-header {
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(94, 108, 132);
    font-size: 24px;
    .close {
      position: absolute;
      right: 20px;
      cursor: pointer;
      height: 24px;
      width: 24px;
    }
    .close:hover {
      color: darkblue;
    }
  }
  .link {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 20px;
    .use-link {
      .link-icon {
        font-size: 23px;
        color: rgb(131, 140, 145);
        margin-right: 10px;
      }
      span {
        color: rgb(23, 43, 77);
        font-weight: 800;
        font-size: 22px;
      }
    }
    .create-link {
      font-size: 22px;
      color: rgb(0, 121, 191);
      cursor: pointer;
      text-decoration: underline rgb(0, 121, 191);
    }
  }
}
</style>