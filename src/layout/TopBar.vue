<template>
  <div class="top-bar">
    <div class="left-bar">
      <icon-bytedance-color class="icon-byte" @click="goToHome" />
      <span class="link" @click="project">项目</span>
    </div>
    <div class="right-bar">
      <!-- <a-input-search placeholder="Please enter something" class="input" />
      <icon-notification class="notifacte" @click="show = !show" />
      <div class="changeEvent" v-if="show">
        <a-empty v-if="store.state.userEvent.length === 0" />
        <div
          class="event"
          v-for="event in store.state.userEvent"
          :key="event.id"
        >
          {{ event.content }}发生改变，请查收
        </div>
      </div> -->
      <a-popover position="br">
        <a-avatar
          :style="{ backgroundColor: '#3370ff' }"
          class="avatar"
          @click="inviteCard = !inviteCard"
        >
          <IconUser />
        </a-avatar>
        <template #content>
          <div class="userInfo">
            <div class="invite-header">
              <span>账号</span>
              <!-- <icon-close class="close" /> -->
            </div>
            <div class="center">
              <a-avatar :style="{ backgroundColor: '#3370ff' }" class="info">
                <IconUser />
              </a-avatar>
              <div
                style="display: flex; flex-direction: column; margin-left: 1vw"
              >
                <div style="font-size: 16px">
                  {{ fullname }}
                </div>
                <div
                  style="
                    color: rgb(197, 202, 210);
                    font-size: 12px;
                    margin-top: 0.5vw;
                  "
                >
                  {{ email }}
                </div>
              </div>
            </div>
            <div class="logout" @click="toboard">登出账号</div>
          </div>
        </template>
      </a-popover>
    </div>
  </div>
</template>
<script lang="ts">
import {
  IconBytedanceColor,
  IconNotification,
  IconUser,
  IconClose,
} from "@arco-design/web-vue/es/icon";
import { defineComponent, computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
export default defineComponent({
  name: "TopBar",
  components: {
    IconBytedanceColor,
    IconNotification,
    IconUser,
    IconClose,
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    let inviteCard = ref(false);
    const show = ref(false);
    const toboard = () => {
      Message.success({ content: "已退出账号" });
      localStorage.removeItem("token");
      router.push({ name: "Home" });
    };
    const project = () => {
      router.push("/Layout/WorkPlace");
    };
    const goToHome = () => {
      router.push("/");
    };
    const fullname = computed(() => {
      return store.state.currentUserInfo.fullname;
    });
    const email = computed(() => {
      return store.state.currentUserInfo.username;
    });

    return {
      show,
      store,
      fullname,
      email,
      toboard,
      project,
      inviteCard,
      goToHome,
    };
  },
});
</script>

<style lang="less" scoped>
@import "@/components/card/scrollCss/scroll.scss";
.top-bar {
  position: relative;
  display: flex;
  height: 80px;
  width: 100%;
  background-color: rgba(@cardTextColorMain, 0.45);
  backdrop-filter: blur(10px);
  .left-bar {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    .icon-byte {
      margin-left: 50px;
      width: 50px;
      height: 50px;
    }
    .link {
      margin-left: 50px;
      font-size: 24px;
      font-weight: 700;
      // color: rgba(@cardColorMain, 1);
      color: #fff;
      line-height: 25px;
      border-radius: 5px;
      padding: 10px 5px;
      cursor: pointer;
      // border: 1px solid rgba(@cardColorMain, 1);
      border: 1px solid #fff;
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .link:hover {
      background-color: rgba(@cardTextColorMain, 0.45);
    }
  }
  .right-bar {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .notifacte {
      width: 50px;
      height: 50px;
      color: rgba(@cardColorMain, 1);
      margin-right: 35px;
      cursor: pointer;
      position: relative;
    }
    .changeEvent {
      overflow-x: hidden;
      overflow-y: visible;
      position: absolute;
      right: 10px;
      top: 85px;
      width: 700px;
      min-height: 100px;
      max-height: 700px;
      border-radius: 10px;
      background-color: rgba(@cardColorWrapper, 1);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      transition: all 0.5s ease-in-out;
      .event {
        font-size: 200px;
        padding: 10px;
        flex-shrink: 0;
        width: 700px;
        height: 50px;
        background-color: rgba(@cardColorWrapper, 0.2);
        border-radius: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
      }
    }
    .input {
      margin-right: 40px;
      width: 360px;
      height: 50px;
    }
    .avatar {
      margin-right: 35px;
      width: 50px;
      height: 50px;
    }
  }
}
.userInfo {
  width: 400px;
  // position: absolute;
  background-color: white;
  top: 85px;
  right: 5px;
  border-radius: 10px;
  padding: 10px;
  border-radius: 10px;
  // box-shadow: 0 8px 16px -4px #091e4240, 0 0 0 1px #091e4214;
  display: flex;
  flex-direction: column;
  //  transform: translateY(0px);
  .invite-header {
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(94, 108, 132);
    font-size: 24px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    padding: 10px;
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
  .center {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .info {
      height: 50px;
      width: 50px;
    }
  }
  .logout {
    width: 95%;
    margin-top: 20px;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    font-size: 20px;
  }
  .logout:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
