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
      <p>标签</p>
      <div class="labels">
        <div class="label" v-for="item in labelList" :key="item.id">
          <div :style="{ backgroundColor: item.color }" class="label_color">
            {{ item.tagName }}
          </div>
          <span class="icon_pen">
            <IconPenFill @click="showEditLabel(item)" />
          </span>
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
        v-model="newLabelData.tagName"
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
    <div v-show="isShow.edit">
      <div class="header">
        <span>修改标签</span>
        <IconLeft @click.self="backToAll" class="icon_left" />
        <IconCloseCircle @click.self="close" class="icon-close" />
      </div>
      <p>标签名</p>
      <a-input
        :model-value="editData.tagName"
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
          @click="chooseColor($event, color, 'edit')"
        ></div>
        <span class="text">没有颜色。<br />这不会显示在卡片封面上。</span>
      </div>
      <div class="bottom_buttons">
        <a-button type="primary" @click.self="editLabel" size="large"
          >保存</a-button
        >
        <a-button
          type="primary"
          status="danger"
          @click.self="deleteLabel"
          size="large"
          >删除</a-button
        >
      </div>
    </div>
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
import { LabelElement } from "@/axios/globalInterface";
import {
  createNewLabel,
  deleteLabelById,
  getTagsByProductId,
  editLabelApi,
} from "@/axios/labelApi";
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
    const productId = ref(route.params.productId);
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
    // const task = computed(() => {
    //   return store.getters.getTask(route.params.id);
    // });
    const newLabelData = reactive({
      color: "#61bd4f",
      tagName: "",
      productId: parseInt(productId.value as string),
    });
    const pressEnter = () => {
      console.log(newLabelData);
    };
    const chooseColor = (e: MouseEvent, color: string, type?: string) => {
      if (type === "new") {
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
      } else if (type === "edit") {
      }
    };
    const addNewLabel = async () => {
      // console.log("addNewLabel---" + JSON.stringify(newLabelData));
      if (!newLabelData.color || !newLabelData.tagName) {
        console.log(newLabelData);
        Message.error("请确定颜色与标签名是否完整");
        return;
      }
      const res = await createNewLabel(newLabelData);
      console.log(res);
      if (res.id) {
        const tempObj: LabelElement = {
          color: "",
          id: "",
          productId: "",
          tagName: "",
        };
        Object.assign(tempObj, res);
        console.log(tempObj);
        console.log(res);
        console.log(res == tempObj);
        console.log(res === tempObj);

        labelList.push({
          tempObj,
        });
      }
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

    const showEditLabel = (item: LabelElement) => {
      isShow.all = false;
      isShow.edit = true;
      Object.assign(editData, item);
    };
    const editData = reactive({
      color: "",
      id: 0,
      productId: 0,
      tagName: "",
    });
    const editLabel = async () => {
      console.log(editData);
      // const res = editLabelApi(editData);
      // console.log(res);
    };

    /**
     * 删除标签
     * @param labelId
     * @returns
     */
    const deleteLabel = async () => {
      const id = editData.id;
      const res = deleteLabelById(id);
      console.log(res);
    };

    const labelList: LabelElement[] = reactive([]);
    const getLabels = async () => {
      const productId = route.params.productId as string;
      const res = await getTagsByProductId(productId);
      res.forEach((el: LabelElement) => {
        labelList.push(el);
      });
    };
    getLabels();
    return {
      store,
      colors,
      isShow,
      newLabelData,
      labelList,
      editData,
      pressEnter,
      chooseColor,
      addNewLabel,
      showEditLabel,
      close,
      showAddLabel,
      backToAll,
      deleteLabel,
      editLabel,
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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p {
      width: 100px;
    }
    .label {
      position: relative;
      display: flex;
      height: 50px;
      width: 100%;
      margin-top: 10px;

      .label_color {
        display: flex;
        align-items: center;

        box-sizing: border-box;
        width: calc(100% - 50px);
        height: 100%;
        line-height: 40px;

        padding-left: 3%;
        border-radius: 5px;

        color: white;
        font-weight: 800;
      }
      .icon_pen {
        position: absolute;
        right: 0;
        margin: 5px 5px;

        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 24px;
        height: 40px;
        width: 40px;
        line-height: 40px;
      }
      .icon_pen:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .new_label {
    text-align: center;
    height: 50px;
    line-height: 50px;
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
