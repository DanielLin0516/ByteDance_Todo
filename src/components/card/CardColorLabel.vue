<template>
  <div class="outer">
    <!-- 全部 -->
    <div v-show="isShow.all">
      <div class="header">
        <span>标签</span>
        <IconCloseCircle @click.self="close" class="icon-close" />
      </div>
      <a-input
        :style="{ width: '100%' }"
        placeholder="搜索标签~~"
        @press-enter="pressEnter"
        allow-clear
        class="fontsize"
      />
      <div class="labels">
        <p>标签</p>
        <div class="label">
          <div :style="{ backgroundColor: 'green' }" class="label_color">
            syg
          </div>
          <IconPenFill @click="showEditLabel" class="icon_pen" />
        </div>
      </div>
      <p @click="showAddLabel" class="new_label">新建标签</p>
    </div>
    <!-- 新增 -->
    <div v-show="isShow.add">
      <div class="header">
        <span>创建标签</span>
        <IconLeft @click.self="backToAll" class="icon_left" />
        <IconCloseCircle @click.self="close" class="icon-close" />
      </div>
      <p>标签名</p>
      <a-input
        v-model="newLabelData.content"
        :style="{ width: '100%' }"
        @blur="pressEnter"
        allow-clear
      />
      <p>选择一个颜色</p>
      <div class="choose_color">
        <div
          class="color"
          v-for="(color, index) in colors"
          :key="index"
          :style="{ backgroundColor: color }"
          @click="chooseColor($event, color)"
        >
          <span v-if="index === 0">✔</span>
        </div>
        <span class="text">没有颜色。<br />这不会显示在卡片封面上。</span>
      </div>
      <a-button
        style="margin-top: 5px"
        type="primary"
        @click.self="addNewLabel"
        size="large"
        >保存</a-button
      >
    </div>
    <!-- 编辑 -->
    <!-- <div v-show="isShow.edit">
      <div class="header">
        <span>修改标签</span>
        <IconLeft @click.self="backToAll" class="icon_left" />
        <IconCloseCircle @click.self="close" class="icon-close" />
      </div>
      <p>标签名</p>
      <a-input
        :model-value="newLabelData.content"
        :style="{ width: '100%' }"
        @press-enter="pressEnter"
        allow-clear
      />
      <p>选择一个颜色</p>
      <div class="choose_color">
        <div
          class="color"
          v-for="(color, index) in colors"
          :key="index"
          :style="{ backgroundColor: color }"
          @click="chooseColor($event, color)"
        ></div>
        <span class="text">没有颜色。<br />这不会显示在卡片封面上。</span>
      </div>
      <div class="bottom_buttons">
        <a-button
          type="primary"
          @click.self="addNewLabel"
          size="large"
          >保存</a-button
        >
        <a-button
          type="primary"
          status="danger"
          @click.self="addNewLabel"
          size="large"
          >删除</a-button
        >
      </div>
    </div> -->
  </div>
</template>
<script lang="ts">
import {
  IconCloseCircle,
  IconPenFill,
  IconLeft,
} from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { defineComponent, computed, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { createNewLabel, getTagsByProductId } from "@/axios/api";
export default defineComponent({
  components: {
    IconCloseCircle,
    IconPenFill,
    IconLeft,
  },
  data() {
    return {
      searchValue: "",
    };
  },
  emits: ["close"],
  setup(props, context) {
    const route = useRoute();

    const store = useStore();
    let time = ref(null);
    const isShow = reactive({
      all: true,
      edit: false,
      add: false,
    });
    const colors = reactive([
      "#61bd4f",
      "#f5de33",
      "#ff9f1a",
      "#eb5a46",
      "#c377e0",
      "#0079bf",
      "#00c2e0",
      "#51e898",
      "#ff78cb",
      "#344563",
      "#b3bac5",
    ]);
    const task = computed(() => {
      return store.getters.getTask(route.params.id);
    });
    const newLabelData = reactive({
      color: "#61bd4f",
      content: "",
      productId: "",
    });
    const pressEnter = () => {
      console.log(newLabelData);
    };
    const chooseColor = (e: MouseEvent, color: string) => {
      newLabelData.color = color;

      const el = e.target as HTMLDivElement;
      const els = el.parentElement?.children;
      for (let i = 0; i < els?.length; i++) {
        if (els[i].innerText) {
          els[i].innerText = "";
          break;
        }
      }
      el.innerText = "✔";
    };
    const addNewLabel = async () => {
      console.log("addNewLabel---" + JSON.stringify(newLabelData));
      console.log(typeof route.params.productId);
      if (!newLabelData.color || !newLabelData.content) {
        Message.error("请确定颜色与标签名是否完整");
        return;
      }
      const res = await createNewLabel(newLabelData);
      console.log(res);
    };
    const close = () => {
      context.emit("close");
    };
    const showAddLabel = () => {
      isShow.add = true;
      isShow.all = false;
    };
    const backToAll = () => {
      isShow.edit = false;
      isShow.add = false;
      isShow.all = true;
    };
    const showEditLabel = () => {
      isShow.all = false;
      isShow.edit = true;
    };
    const getLabels = async () => {
      const productId = route.params.productId as string;
      const res = await getTagsByProductId(productId);
      console.log(res);
    };
    getLabels();
    return {
      store,
      colors,
      isShow,
      newLabelData,

      pressEnter,
      chooseColor,
      addNewLabel,
      showEditLabel,
      close,
      showAddLabel,
      backToAll,
    };
  },
});
</script>

<style lang="scss" scoped>
$color: red;
$white: rgb(255, 255, 255);
.outer {
  position: absolute;
  width: 350px;
  max-height: 100%;
  padding: 20px;
  top: 0px;
  right: -200px;

  display: flex;
  flex-direction: column;

  border-radius: 5px;
  background-color: $white;
  box-shadow: 0px 0px 6px gray;
  // border-left: 1px solid rgba(0, 0, 0, 0.3);

  // overflow-y: scroll;
  .header {
    position: relative;

    height: 40px;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    margin-bottom: 30px;

    span {
      font-size: 22px;
      height: 100%;
    }
    .icon-close,
    .icon_left {
      position: absolute;
      right: -5px;
      top: -5px;

      height: 100%;
      width: 40px;

      border-radius: 50%;
      font-size: 10px;
      color: rgba(0, 0, 0, 0.5);

      transition: all 0.4s;
    }
    .icon_left {
      left: 0;
    }
    .icon-close,
    .icon_left:hover {
      background-color: rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.4s;
    }
  }

  .labels {
    // display: flex;
    p {
      width: 100px;
    }
    .label {
      position: relative;
      display: flex;
      height: 40px;
      width: 100%;

      .label_color {
        box-sizing: border-box;
        width: 90%;
        height: 100%;
        line-height: 40px;
        // line-height: 100%;??

        padding-left: 3%;
        border-radius: 5px;

        color: white;
        font-weight: 800;
      }
      .icon_pen {
        position: absolute;
        right: 0;
        font-size: 24px;
        height: 100%;
        line-height: 100%;
      }
      .icon_pen:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .new_label {
    text-align: center;
    height: 35px;
    line-height: 35px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .new_label:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  .choose_color {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
    grid-auto-rows: minmax(20px, auto);
    justify-items: center;
    .color {
      display: flex;
      align-items: center;
      justify-content: center;

      height: 40px;
      width: 100%;
      line-height: 100%;
      border-radius: 3px;
      color: white;
    }
    .color:hover {
      cursor: pointer;
      opacity: 0.8;
    }
    .choosed {
      transform: scale(0.9);
      color: white;
    }
    .text {
      grid-column: 2 / 6;
      grid-row: 3;
    }
  }
  .bottom_buttons {
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
  }
}
.fontsize {
  ::v-deep .arco-input-size-medium {
    // font-size: 70px;
  }
}
</style>