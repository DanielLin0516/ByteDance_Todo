<template>
  <div class="sidebar">
    <span class="sidebar-tip">添加至卡片</span>
    <span class="button-link" title="成员" @click="showMember">
      <icon-user />
      <span class="sidebar-text">成员</span>
    </span>
    <span class="button-link" title="标签" @click="showColorLable">
      <icon-tag />
      <span class="sidebar-text">标签</span>
    </span>
    <span
      class="button-link"
      @mousedown="store.state.show = !store.state.show"
      title="日期"
    >
      <icon-schedule />
      <span class="sidebar-text">日期</span>
    </span>

    <span class="button-link" title="拉伸" @click="bgc = !bgc">
      <icon-layout />
      <span class="sidebar-text">拉伸</span>
    </span>
    <card-bgc
      :id="id"
      :columnName="columnName"
      :lists="lists"
      v-show="bgc"
      :bgc="bgc"
      @bgcShow="bgcShow"
    ></card-bgc>
  </div>
  <div>
    <CardColorLabel
      v-if="isColorShow"
      @close="closeColor"
      v-bind="$attrs"
    ></CardColorLabel>
    <TaskMember
      v-if="isMemberShow"
      @close="closeMember"
      v-bind="$attrs"
    ></TaskMember>
  </div>
  <date v-show="store.state.show" @time="recieveTime" :lists="lists" />
</template>

<script lang="ts">
import Date from "./Date.vue";
import {
  IconUser,
  IconTag,
  IconUnorderedList,
  IconSchedule,
  IconFile,
  IconLayout,
} from "@arco-design/web-vue/es/icon";
import { defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
import CardColorLabel from "@/components/card/CardColorLabel.vue";
import TaskMember from "@/components/card/TaskMember.vue";
import CardBgc from "@/components/card/CardBgc.vue";
export default defineComponent({
  inheritAttrs: false,
  components: {
    IconUser,
    IconTag,
    IconUnorderedList,
    IconSchedule,
    IconFile,
    Date,
    CardColorLabel,
    TaskMember,
    IconLayout,
    CardBgc,
  },
  props: {
    lists: Object,
    id: String,
    columnName: String,
  },
  emits: ["timeDate"],
  setup(props, context) {
    const store = useStore();
    let show = store.state.show;
    const isColorShow = ref(false);
    const isMemberShow = ref(false);
    let bgc = ref(false);
    let timePeriod = reactive({});
    const showColorLable = () => {
      isColorShow.value = true;
    };
    const showMember = () => {
      isMemberShow.value = true;
    };
    const closeColor = () => {
      isColorShow.value = false;
    };
    const closeMember = () => {
      console.log("closeMember---");
      isMemberShow.value = false;
    };
    const recieveTime = (e: object) => {
      timePeriod = e;
      context.emit("timeDate", timePeriod);
    };
    const bgcShow = (e: boolean) => {
      console.log("收到的值", e);
      bgc.value = e;
    };

    return {
      store,
      isColorShow,
      isMemberShow,
      showColorLable,
      closeColor,
      closeMember,
      showMember,
      recieveTime,
      bgcShow,
      bgc,
    };
  },
});
</script>

<style lang="less" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  text-align: left;
  color: rgba(@cardTextColorSub, 1);
  position: absolute;
  right: 50px;
  top: 120px;
}
.sidebar-tip {
  font-weight: 700;
}
.button-link {
  color: rgba(@cardTextColorMain, 1);
  background-color: rgba(@cardColorWrapper, 1);
  border-radius: 3px;
  box-sizing: border-box;
  cursor: pointer;
  height: 32px;
  margin-top: 8px;
  max-width: 300px;
  overflow: hidden;
  padding: 6px 12px;
  text-decoration: none;
  text-overflow: ellipsis;
  transition-duration: 85ms;
  transition-property: background-color, border-color, box-shadow;
  transition-timing-function: ease;
}
.button-link:hover {
  background: rgba(@cardTextColorSub, 0.4);
}
.sidebar-text {
  margin-left: 10px;
  font-size: 16px;
  color: rgba(@cardTextColorMain, 1);
}
</style>