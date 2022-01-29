<template>
  <div :class="leftDraw" id="parentNode" @mousedown="handleClick">
    <IconRightCircle class="icon-right-circle" v-show="!visible" />
  </div>
  <a-drawer
    popup-container="#parentNode"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    placement="left"
    :mask="false"
    class="drawer"
  >
    <template #title>组员分工:</template>
    <div>
      <span>lyt</span>
      <span>lyt</span>
      <span>lyt</span>
      <span>lyt</span>
      <span>lyt</span>
      <span>lyt……</span>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { IconRightCircle } from "@arco-design/web-vue/es/icon";
import { defineComponent, ref, reactive, watch } from "vue";
export default defineComponent({
  name: "LeftDrawer",
  components: {
    IconRightCircle,
  },
  setup(props) {
    let visible = ref(false);
    let leftDraw = reactive({
      "left-drawer-sitck": !visible.value,
      "left-drawer-stick-open": visible.value,
    });
    watch(visible, (val) => {
      leftDraw["left-drawer-sitck"] = !val;
      leftDraw["left-drawer-stick-open"] = val;
      console.log(val);
    });
    function handleClick() {
      visible.value = true;
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
    };
  },
});
</script>

<style lang="less" scoped>
.left-drawer-sitck {
  width: 30px;
  height: calc(100% - 80px);
  position: relative;
  background-color: rgba(@cardColorMain, 0.16);
  border-right: 1px solid rgba(@cardColorWrapper, 0.5);
  display: flex;
  float: left;
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
.left-drawer-sitck:hover {
  background-color: rgba(@cardColorWrapper, 0.552);
}

.left-drawer-stick-open {
  width: 250px !important;
  height: calc(100% - 80px);
  position: relative;
  background-color: rgba(@cardColorMain, 0.16);
  border-right: 1px solid rgba(@cardColorWrapper, 0.5);
  display: flex;
  cursor: pointer;
  float: left;
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
  width: 250px !important;
}
::v-deep .drawer {
  background-color: rgba(@cardTextColorMain, 0.16);
}
::v-deep .arco-drawer-body {
  color: rgba(@cardTextColorSub, 1);
  background-color: rgba(@cardColorWrapper, 1);
}
::v-deep .arco-drawer-header {
  background-color: rgba(@cardColorWrapper, 1);
  .arco-drawer-title {
    color: rgba(@cardTextColorMain, 1);
  }
}
::v-deep .arco-drawer-footer {
  background-color: rgba(@cardColorWrapper, 1);
  color: rgba(@cardTextColorMain, 1);
}
</style>
