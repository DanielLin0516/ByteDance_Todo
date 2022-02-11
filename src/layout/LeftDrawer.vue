<template>
  <div :class="leftDraw" id="parentNode">
    <IconRightCircle
      class="icon-right-circle"
      v-show="!visible"
      @click.prevent="handleClick"
    />
  </div>
  <a-drawer
    popup-container="#parentNode"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    placement="left"
    :mask="false"
    class="drawer"
    :unmount-on-close="true"
    :drawer-style="{ background: background }"
  >
    <template #title>
      <h3>项目成员</h3>
    </template>
    <div>
      <a-list class="memberList" v-if="!loading">
        <a-list-item v-for="(item, index) in data" :key="item.userId">
          <a-list-item-meta :title="item.fullname" :description="item.username">
            <template #avatar>
              <a-avatar :style="{ background: item.avatar }">{{
                item.fullname.slice(0, 1)
              }}</a-avatar>
            </template>
          </a-list-item-meta>
          <a-popconfirm
            content="确定踢踢出该人?"
            @ok="kick(item.userId, index)"
          >
            <a-button
              type="primary"
              v-show="store.state.showInviteButton && item.userId != mySelfId"
              >踢出</a-button
            >
          </a-popconfirm>
        </a-list-item>
      </a-list>
    </div>
    <template #footer>
      <div></div>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { getMemberListByProductId, kickMember } from "@/axios/api";
import { useRequest } from "@/hooks/useRequest";
import { Message } from "@arco-design/web-vue";
import { IconRightCircle, IconUser } from "@arco-design/web-vue/es/icon";
import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed,
  ComputedRef,
  provide,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "LeftDrawer",
  components: {
    IconRightCircle,
    IconUser,
  },
  setup(props) {
    let visible = ref(false);
    const route = useRoute();
    const store = useStore();
    let leftDraw = reactive({
      "left-drawer-sitck": !visible.value,
      "left-drawer-stick-open": visible.value,
    });
    watch(visible, (val) => {
      leftDraw["left-drawer-sitck"] = !val;
      leftDraw["left-drawer-stick-open"] = val;
      console.log(val);
    });

    // 路由中的项目Id
    const productId: ComputedRef<string> = computed(() => {
      return route.params.productId as string;
    });

    const background: ComputedRef<string> = computed(() => {
      const isD = store.state.isDark;
      return isD ? "#323232" : store.state.background;
    });

    const mySelfId = computed(() => {
      return store.state.currentUserInfo.userId;
    });

    const { data, loading, error, run } = useRequest(getMemberListByProductId, {
      onError: () => {
        console.trace(error);
      },
    });
    const kick = async (userId: number, index: number) => {
      try {
        await kickMember(Number(productId.value), userId);
        Message.success({ content: "成功踢除！" });
        data.value?.splice(index, 1);
        store.commit("setMemberList", data.value);
      } catch (error) {
        Message.error({ content: `${error}` });
      }
    };

    function handleClick() {
      visible.value = true;
      run(productId.value);
    }
    function handleOk() {
      visible.value = false;
    }
    function handleCancel() {
      visible.value = false;
    }
    return {
      visible,
      handleClick,
      handleOk,
      handleCancel,
      leftDraw,
      data,
      loading,
      background,
      kick,
      store,
      mySelfId,
    };
  },
});
</script>

<style lang="less" scoped>
.left-drawer-sitck {
  width: 30px;
  height: calc(100% - 80px);
  position: relative;
  background-color: rgba(@cardColorMain, 0.3);
  border-right: 1px solid rgba(@cardColorWrapper, 0.4);
  display: flex;
  float: left;
  transition: width ease-in-out 0.1s;
  cursor: pointer;
  .icon-right-circle {
    width: 50px;
    height: 50px;
    position: absolute;
    left: 10px;
    top: 30px;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    z-index: 999;
  }
}
.memberList {
  max-height: 72vh;
  overflow-y: auto;
}
.left-drawer-sitck:hover {
  background-color: rgba(@cardColorWrapper, 0.4);
}

.left-drawer-stick-open {
  width: 350px !important;
  height: calc(100% - 80px);
  position: relative;
  background-color: rgba(@cardColorMain, 0.1);
  border-right: 1px solid rgba(@cardColorWrapper, 0.5);
  display: flex;
  cursor: pointer;
  float: left;
  transition: width ease-in-out 0.3s;
  .icon-right-circle {
    width: 50px;
    height: 50px;
    position: absolute;
    left: 380px;
    top: 20px;
    color: rgba(@cardColorMain, 0.7);
    cursor: pointer;
  }
}
::v-deep .arco-icon-hover::before {
  background: #fff;
}
::v-deep .arco-drawer {
  width: 350px !important;
}
::v-deep .drawer {
  background-color: rgba(@cardTextColorMain, 0.1);
  // opacity: 0.6;
}
::v-deep .arco-drawer-body {
  color: rgba(@cardTextColorSub, 1);
  background-color: rgba(@cardColorWrapper, 0.1);
}
::v-deep .arco-drawer-header {
  background-color: rgba(@cardColorWrapper, 0.1);
  border-bottom: 1px solid rgba(@drawerBorder, 0.5);
  .arco-drawer-title {
    color: rgba(@cardTextColorMain, 1);
  }
}
::v-deep .arco-drawer-footer {
  background-color: rgba(@cardColorWrapper, 0.1);
  color: rgba(@cardTextColorMain, 1);
}
::v-deep .arco-list-item-meta-title {
  color: rgba(@cardTextColorMain, 1);
}
::v-deep .arco-list-item-meta-description {
  color: rgba(@cardTextColorMain, 0.7);
}

::v-deep .arco-list-bordered {
  border: 0px;
}

::v-deep .arco-list-split .arco-list-item:not(:last-child) {
  border-bottom: 1px solid rgba(@drawerBorder, 0.5);
}

::v-deep .arco-drawer-footer {
  border-top: 0px;
}
</style>
