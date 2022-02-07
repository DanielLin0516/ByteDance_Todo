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
        v-model="searchValue"
        placeholder="搜索标签~~"
        @input="searchTag($event)"
        allow-clear
        class="fontsize"
      />
      <p>标签</p>
      <div class="labels">
        <div
          class="label"
          v-for="(item, index) in labelList"
          :key="item.id"
          v-show="item.show"
        >
          <div
            :style="{ backgroundColor: item.color }"
            class="label_color"
            data-choosed="false"
            @click="labelClick(item.id, index, $event)"
          >
            {{ item.tagName }}
          </div>
          <span class="icon_pen">
            <IconPenFill @click="showEditLabel(item)" />
          </span>
        </div>
      </div>
      <p @click="showAddLabel" class="new_label" ref="addSpan">新建标签</p>
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
        allow-clear
      />
      <p>选择一个颜色</p>
      <div class="choose_color">
        <div
          class="color"
          v-for="(color, index) in colors"
          :key="index"
          :style="{ backgroundColor: color }"
          @click="chooseColor($event, color, 'new')"
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
        v-model="editData.tagName"
        :style="{ width: '100%' }"
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
import { defineComponent, inject, ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { LabelElement } from "@/axios/globalInterface";
import {
  createNewLabel,
  deleteLabelApi,
  getTagsByProductId,
  editLabelApi,
  setTagByCardId,
  deleteTagInCard,
} from "@/axios/labelApi";
export default defineComponent({
  components: {
    IconCloseCircle,
    IconPenFill,
    IconLeft,
  },
  emits: ["close"],
  setup(props, context) {
    const addSpan = ref(null);
    const cardId: string = inject("cardId") as string;

    const route = useRoute();
    const store = useStore();
    const productId = ref(route.params.productId);
    const isShow = reactive({
      all: true,
      edit: false,
      add: false,
    });
    interface webLabel extends LabelElement {
      show: boolean;
      isChoosed: boolean;
    }
    const labelList: webLabel[] = store.state.labelList;
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
    const newLabelData = reactive({
      color: "#61bd4f",
      tagName: "",
      productId: parseInt(productId.value as string),
    });

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

    const labelClick = async (tagId: string, index: number, e: MouseEvent) => {
      const el: HTMLDivElement = e.target as HTMLDivElement;
      el.dataset;
      console.log([cardId, tagId]);

      if (el.dataset.choosed === "false") {
        el.dataset.choosed = "true";
        el.classList.add("choosed");
        //加到数据库
        await setTagByCardId(cardId, tagId);
        return true;
      } else {
        el.dataset.choosed = "false";
        el.classList.remove("choosed");
        await deleteTagInCard(cardId, tagId);
        return false;
      }
    };

    // const isShowChoosed = (e: MouseEvent) => {
    //   const el: HTMLSpanElement = e.target as HTMLSpanElement;
    //   const elp: HTMLDivElement = el.parentElement as HTMLDivElement;

    //   return elp.dataset.choosed == "true";
    // };

    const searchValue = ref("");
    const searchTag = (e: string) => {
      if (e) {
        labelList.forEach((el) => (el.show = false));
        let count = 0;
        labelList.forEach((el) => {
          if (el.tagName.includes(e)) {
            el.show = true;
            count++;
          }
        });
        if (!count) {
          // console.log(addSpan.value);
          addSpan.value.innerText = `创建名为"${e}"的标签`;
          newLabelData.tagName = e;
        }
      } else {
        addSpan.value.innerText = `新建标签`;
        newLabelData.tagName = "";
        labelList.forEach((el) => (el.show = true));
      }
    };

    const chooseColor = (e: MouseEvent, color: string, type: string) => {
      if (type === "new") {
        newLabelData.color = color;
        const el = e.target as HTMLDivElement;
        const els: HTMLCollection = el.parentElement
          ?.children as HTMLCollection;
        for (let i = 0; i < els?.length; i++) {
          if (els[i].innerText) {
            els[i].innerText = "";
            break;
          }
        }
        el.innerText = "✔";
      } else if (type === "edit") {
        editData.color = color;
        const el = e.target as HTMLDivElement;
        const els: HTMLCollection = el.parentElement
          ?.children as HTMLCollection;
        for (let i = 0; i < els?.length; i++) {
          if (els[i].innerText) {
            els[i].innerText = "";
            break;
          }
        }
        el.innerText = "✔";
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
        const tempObj: webLabel = {
          color: "",
          id: "",
          productId: "",
          tagName: "",
          show: true,
          isChoosed: true,
        };
        Object.assign(tempObj, res);
        labelList.push(tempObj);
        //清空之前选中的颜色和name
        newLabelData.color = "#61bd4f";
        newLabelData.tagName = "";
        //返回
        backToAll();
        //可能是搜索时候创建的，此时需要清空
        searchValue.value = "";
        searchTag("");
      }
    };

    const editData = reactive({
      color: "",
      id: 0,
      productId: 0,
      tagName: "",
    });
    let tempItem: LabelElement;
    const showEditLabel = (item: LabelElement) => {
      isShow.all = false;
      isShow.edit = true;
      //editData赋值
      Object.assign(editData, item);
      //保存item
      tempItem = item;
    };
    const editLabel = async () => {
      console.log(editData);
      const res = await editLabelApi(editData);
      console.log(res);

      //修改本地
      tempItem.tagName = editData.tagName;
      tempItem.color = editData.color;
      //返回
      backToAll();
      //垃圾回收--ts报错--LabelElement
      // tempItem = null;
    };

    /**
     * 删除标签
     * @param labelId
     * @returns
     */
    const deleteLabel = async () => {
      const id = editData.id;
      const result = await deleteLabelApi(id); //删除了返回{}

      if (!result) {
        Message.success("删除成功~");
        //删除本地
        const index = labelList.findIndex(
          (item: LabelElement) => item.id === id.toString()
        );
        labelList.splice(index, 1);
        backToAll();
      }
    };

    // interface webLabel extends LabelElement {
    //   show: boolean;
    //   isChoosed: boolean;
    // }
    // const labelList: webLabel[] = reactive([]);
    // const choosedList: boolean[] = reactive([]);
    // const getProductLabels = async () => {
    //   const productId = route.params.productId as string;
    //   const res = await getTagsByProductId(productId);
    //   res.forEach((el: LabelElement) => {
    //     labelList.push(Object.assign(el, { show: true, isChoosed: false }));
    //     choosedList.push(false);
    //   });
    //   // console.log(labelList);
    // };
    // getProductLabels();
    return {
      store,
      colors,
      isShow,
      newLabelData,
      labelList,
      editData,
      addSpan,
      searchValue,

      searchTag,
      chooseColor,
      addNewLabel,
      showEditLabel,
      close,
      showAddLabel,
      backToAll,
      deleteLabel,
      editLabel,
      labelClick,
      // isShowChoosed,
    };
  },
});
</script>

<style lang="less" scoped>
@import url("./scrollCss/scroll.scss");
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
  background-color: white;
  box-shadow: 0px 0px 6px gray;
  // border-left: 1px solid rgba(0, 0, 0, 0.3);

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
      right: -12px;
      top: -15px;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      padding: 10px;
      color: rgba(@cardTextColorMain, 0.5);

      transition: all 0.4s;

      &:hover {
        cursor: pointer;
        background-color: rgba(@cardTextColorMain, 0.1);
        transition: all 0.4s;
      }
    }
    .icon_left {
      left: 0;
    }
  }

  .labels {
    max-height: 40vh;
    overflow-y: scroll;
    p {
      width: 100px;
    }
    .label {
      position: relative;
      display: flex;
      height: 50px;
      width: 100%;
      margin-top: 10px;

      :hover {
        transform: scale(1.02);
        cursor: pointer;
      }
      .label_color {
        position: relative;
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

        span {
          position: absolute;
          right: 5%;
        }
      }
      .choosed {
        &::after {
          content: "✔";
          color: white;
          position: absolute;
          right: 20px;
        }
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
