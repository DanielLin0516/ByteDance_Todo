<template>
  <div class="small-bar">
    <!-- 第二个菜单栏 -->
    <div class="second-bar">
      <input
        class="product-name"
        style="margin-right: 1vw"
        v-model="productName"
        @change="changeItem"
      />
      <Avatar />
      <div class="inviteUser" v-show="showInviteButton" @click="inviteShow">
        <icon-user class="icon-user" />
        <div>邀请朋友</div>
      </div>
      <div class="change" @click="changeTheme($event)">{{ themeText }}</div>
      <a-popover position="bottom">
        <div class="changeColor">改变颜色</div>
        <template #content>
          <div class="creat-project">
            <span>调整颜色</span>
            <div class="square" :style="{ background: upSquare }"></div>
            <div class="back-ground">
              <div class="content">背景</div>
              <div class="color-choose">
                <div
                  class="choose"
                  :style="{ background: choose.color }"
                  v-for="choose in color"
                  :key="choose.id"
                  @click="yourChoice(choose.color)"
                ></div>
              </div>
              <a-button
                type="primary"
                style="
                  margin-top: 2vw;
                  width: 100%;
                  border-radius: 1vw;
                  height: 3vw;
                "
                @click="changeBGC"
              >更改</a-button>
            </div>
          </div>
        </template>
      </a-popover>
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
    <div
      style="font-size: 1vw; color: rgb(rgb(131, 140, 145)); margin-bottom: 1vw"
    >具有该链接的任何人均可加入为看板成员</div>
    <a-spin :size="20" v-if="loading" />
    <div style="width: 100%; display: flex; flex-direction: column" v-show="inviteCodeData">
      <a-input style="width: 100%; margin-bottom: 0.5vw" allow-clear :model-value="link" />
      <a-button type="primary" style="width: 6vw; height: 2vw" @click="copy">复制链接</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IconUser,
  IconMoonFill,
  IconClose,
  IconLink,
} from "@arco-design/web-vue/es/icon";
import { computed, defineComponent, ref, onBeforeUpdate, reactive, inject } from "vue";
import Avatar from "@/layout/Avatar.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { setTheme } from "@/theme/theme";
import { getInviteCode } from "@/axios/api";
import { useRequest } from "@/hooks/useRequest";
import { Message } from "@arco-design/web-vue";
import { changeBackground, itemName } from "@/axios/api";
export default defineComponent({
  name: "SmallBar",
  components: {
    IconUser,
    IconMoonFill,
    IconClose,
    IconLink,
    Avatar,
  },
  setup() {
    const store = useStore();
    const isDark = ref(false);
    isDark.value = store.state.isDark
    console.log('isDark.value', isDark.value);
    const themeText = isDark.value ? '切换默认模式' : '切换夜间模式';
    const inviteCard = ref(false);
    let upSquare = ref(String("#0079BF"));
    const route = useRoute();
    let inviteCodeData = ref(null);
    let link = ref(String(null));
    const userId = computed(() => {
      return store.state.currentUserInfo.userId;
    })
    const productId: any = computed(() => {
      return route.params.productId;
    });
    const inviteShow = () => {
      inviteCard.value = !inviteCard.value;
    };
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
      store.commit('setIsDark', isDark.value)
      sendIsDarkToApp(isDark.value)
    };
    const changeItem = async () => {
      try {
        let res = await itemName(productId.value, store.state.currentProductName);
        Message.success({content:"修改成功"})
      } catch {

      }

    }
    const sendIsDarkToApp: any = inject('sendIsDarkToApp')
    const { data, loading, error, run } = useRequest(getInviteCode, {
      onError: () => {
        console.trace(error);
      },
    });
    let color = reactive([
      {
        id: 1,
        color: "#0079BF",
      },
      {
        id: 2,
        color: "#D29034",
      },
      {
        id: 3,
        color: "#519839",
      },
      {
        id: 4,
        color: "#B04632",
      },
      {
        id: 5,
        color: "#755286",
      },
      {
        id: 6,
        color: "#FFFF00",
      },
      {
        id: 7,
        color: "#00FF00",
      },
      {
        id: 8,
        color: "#61bd4f",
      },
      {
        id: 9,
        color: "#f5de33",
      },
      {
        id: 10,
        color: "#ff9f1a",
      },
      {
        id: 11,
        color: "#eb5a46",
      },
      {
        id: 12,
        color: "#c377e0",
      },
      {
        id: 13,
        color: "#0079bf",
      },
      {
        id: 14,
        color: "#00c2e0",
      },
      {
        id: 15,
        color: "#51e898",
      },
      {
        id: 16,
        color: "#ff78cb",
      },
      {
        id: 17,
        color: "#344563",
      },
      {
        id: 18,
        color: "#b3bac5",
      },
    ]);
    const yourChoice = (c: string) => {
      upSquare.value = c;
    };
    const changeBGC = async () => {
      try {
        await changeBackground(
          productId.value,
          `${upSquare.value.slice(1, 7)}`
        );
        Message.success({ content: "更改成功！" });
        store.commit("setColor", upSquare.value);
      } catch (error) {
        console.trace(error);
      }
    };
    const createLink = async () => {
      const res = await run(userId.value);
      inviteCodeData.value = res;
      const base = window.location.host;
      link.value = `${base}/#/Invite/${productId.value}/${inviteCodeData.value}`;
    };
    const copy = () => {
      let eInput = document.createElement("input");
      eInput.value = link.value;
      document.body.appendChild(eInput);
      eInput.select(); //选择对象
      let copyText = document.execCommand("Copy"); //执行浏览器的复制命令
      eInput.style.display = "none";
      if (copyText) Message.success({ content: "复制成功" });
    };
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
      copy,
      color,
      yourChoice,
      upSquare,
      changeBGC,
      themeText,
      name,
      changeItem
    };
  },
});
</script>

<style lang="less" scoped>
@import url("@/components/card/scrollCss/scroll.scss");
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
      cursor: pointer;
      width: 160px;
      font-size: 23px;
      font-weight: 400;
      height: 30px;
      opacity: 1;
      padding: 10px;
      background-color: transparent;
      font-family: PingFang-Bold-2;
      border: unset;
      color: rgba(@cardTextColorMain, 1);
    }
    .product-name:focus {
      outline: none;
      border-color: #9ecaed;
      box-shadow: 0 0 10px #9ecaed;
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
    .changeColor {
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
    .changeColor:hover {
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
.creat-project {
  width: 330px;
  // height: 500px;
  background-color: white;
  // border:1px solid rgb(103,117,139);
  border-radius: 10px;
  padding: 10px;
  span {
    display: inline-block;
    position: relative;
    padding: 10px;
    font-size: 24px;
    width: calc(100% - 20px);
    text-align: center;
    color: rgb(103, 117, 139);
    border-bottom: 1px solid rgb(0, 121, 191);
  }
  .square {
    height: 100px;
    width: 200px;
    background: #0079bf;
    margin: 20px auto;
    border-radius: 10px;
  }
  .back-ground {
    width: 100%;
    .content {
      font-size: 16px;
      color: rgb(103, 117, 139);
    }
    .color-choose {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      .choose {
        width: 72px;
        height: 30px;
        margin-right: 10px;
        border-radius: 10px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
    .title {
      outline: none;
      margin-top: 10px;
      line-height: 20px;
      font-weight: 400;
      padding: 8px;
      width: calc(100% - 24px);
      color: #172b4d;
      border: 3px solid rgb(223, 225, 230);
    }
    .enter {
      width: 100%;
      height: 50px;
      background-color: rgb(0, 121, 191);
      color: white;
      cursor: pointer;
      text-align: center;
      margin-top: 3vw;
      border-radius: 10px;
    }
    .enter:hover {
      background-color: rgb(2, 106, 167);
    }
  }
}
</style>
