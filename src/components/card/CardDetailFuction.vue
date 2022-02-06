<template>
  <div class="sidebar">
    <span class="sidebar-tip">添加至卡片</span>
    <a class="button-link" title="成员" @click="showMember">
      <icon-user />
      <span class="sidebar-text">成员</span>
    </a>
    <a class="button-link" title="标签" @click="showColorLable">
      <icon-tag />
      <span class="sidebar-text">标签</span>
    </a>
    <a
      class="button-link"
      @mousedown="store.state.show = !store.state.show"
      title="日期"
    >
      <icon-schedule />
      <span class="sidebar-text">日期</span>
    </a>
  </div>
  <div>
    <CardColorLabel v-if="isColorShow" @close="closeColor"></CardColorLabel>
    <TaskMember v-if="isMemberShow" @close="closeMember"></TaskMember>
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
} from "@arco-design/web-vue/es/icon";
import { defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
import CardColorLabel from "@/components/card/CardColorLabel.vue";
import TaskMember from "@/components/card/TaskMember.vue";
export default defineComponent({
  components: {
    IconUser,
    IconTag,
    IconUnorderedList,
    IconSchedule,
    IconFile,
    Date,
    CardColorLabel,
    TaskMember,
  },
  props: {
    lists: Object,
  },
  emits: ["timeDate"],
  setup(props, context) {
    const store = useStore();
    let show = store.state.show;
    const isColorShow = ref(false);
    const isMemberShow = ref(false);

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

    return {
      store,
      isColorShow,
      isMemberShow,
      showColorLable,
      closeColor,
      closeMember,
      showMember,
      recieveTime,
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