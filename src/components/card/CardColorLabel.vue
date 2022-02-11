<template>
  <div class="outer">
    <!-- 全部 -->
    <div v-show="isShow.all">
      <div class="header">
        <h2>标签</h2>
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
      <h3>已有标签</h3>
      <div class="labels">
        <div
          class="label"
          v-for="(item, index) in afterHandleList"
          :key="item.id"
          v-show="item.show"
        >
          <div
            :style="{ backgroundColor: item.color }"
            class="label_color"
            :class="{ choosed: item.isChoosed }"
            @click="clickLabel(item)"
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
        <h2>创建标签</h2>
        <IconLeft @click.self="backToAll" class="icon_left" />
        <IconCloseCircle @click.self="close" class="icon-close" />
      </div>
      <h3>标签名</h3>
      <a-input
        v-model="newLabelData.tagName"
        :style="{ width: '100%' }"
        allow-clear
      />
      <h3>选择一个颜色</h3>
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
        <h2>修改标签</h2>
        <IconLeft @click.self="backToAll" class="icon_left" />
        <IconCloseCircle @click.self="close" class="icon-close" />
      </div>
      <h3>标签名</h3>
      <a-input
        v-model="editData.tagName"
        :style="{ width: '100%' }"
        allow-clear
      />
      <h3>选择一个颜色</h3>
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
import { defineComponent, inject, ref, reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { TagElement, CardElement, webLabel } from "@/axios/globalInterface";
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

    const labelList: TagElement[] = store.state.labelList;
    //afterHandleList预处理
    const afterHandleList: webLabel[] = reactive([]);
    const preHandle = () => {
      const task: CardElement | null = context.attrs.taskInfo as CardElement;
      const currentTags: TagElement[] = task == null ? [] : task.tagList;

      //
      labelList.forEach((el) => {
        const choosedProp = {
          show: true,
          isChoosed: true,
        };
        const notChoosedProp = {
          show: true,
          isChoosed: false,
        };
        const flag = currentTags.some((curEl) => curEl.id === el.id);
        flag
          ? afterHandleList.push(Object.assign(el, choosedProp))
          : afterHandleList.push(Object.assign(el, notChoosedProp));
      });
    };
    preHandle();
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
    watch(
      () => [newLabelData.tagName],
      () => {
        if (newLabelData.tagName.length >= 14) {
          Message.error({ content: "标签名字最大长度不能超过15！" });
        }
      },
      { deep: true }
    );

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
      //新增处的返回，需要重置新增数据状态
      clearNewLabelData();
    };

    const clickLabel = async (tag: webLabel) => {
      const tagId: string = tag.id + "";
      const normalTag: TagElement = {
        color: tag.color,
        id: tag.id,
        productId: tag.productId,
        tagName: tag.tagName,
      };

      if (!tag.isChoosed) {
        tag.isChoosed = true;
        //加到数据库
        await setTagByCardId(cardId, tagId);
      } else {
        tag.isChoosed = false;
        await deleteTagInCard(cardId, tagId);
      }
    };

    const searchValue = ref("");
    const searchTag = (e: string) => {
      if (e) {
        afterHandleList.forEach((el) => (el.show = false));
        let count = 0;
        afterHandleList.forEach((el) => {
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
        afterHandleList.forEach((el) => (el.show = true));
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
      if (!newLabelData.color || !newLabelData.tagName) {
        Message.error("请确定颜色与标签名是否完整");
        return;
      } else if (newLabelData.tagName.length >= 14) {
        Message.error("标签名不能超过15个字符！");
        return;
      }
      const res = await createNewLabel(newLabelData);
      if (res.id) {
        const tempObj: webLabel = {
          color: "",
          id: 0,
          productId: 0,
          tagName: "",
          show: true,
          isChoosed: true,
        };
        Object.assign(tempObj, res);
        afterHandleList.push(tempObj);
        //清空之前选中的颜色和name
        newLabelData.color = "#61bd4f";
        newLabelData.tagName = "";
        await setTagByCardId(cardId, res.id.toString());
        //返回
        backToAll();
        //可能是搜索时候创建的，此时需要清空
        searchValue.value = "";
        searchTag("");
        //清空选择的状态
        clearNewLabelData();
        //新建的马上加到state中中--抛出emit
        store.commit("addNewLabel", res);
      }
    };

    const clearNewLabelData = () => {
      newLabelData.color = "#61bd4f";
      newLabelData.tagName = "";
    };

    const editData = reactive({
      color: "",
      id: 0,
      productId: 0,
      tagName: "",
    });
    let tempItem: TagElement;
    const showEditLabel = (item: TagElement) => {
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
      //垃圾回收--ts报错--TagElement
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
        const index = afterHandleList.findIndex(
          (item: TagElement) => item.id === id
        );
        afterHandleList.splice(index, 1);
        backToAll();
      }
    };
    return {
      store,
      colors,
      isShow,
      newLabelData,
      afterHandleList,
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
      clickLabel,
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
  padding: 10px 20px;
  top: 0px;
  right: -200px;

  display: flex;
  flex-direction: column;

  border-radius: 5px;
  background-color: rgba(@cardColorMain, 1);
  color: rgba(@cardTextColorMain, 0.5);
  box-shadow: 0px 0px 6px gray;
  z-index: 999;

  h3 {
    font-size: smaller;
  }
  .header {
    position: relative;
    line-height: 15px;
    width: 100%;
    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 0.26042vw;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    padding-bottom: 0.52083vw;
    justify-items: center;
    align-items: center;
    align-content: stretch;
    h2 {
      grid-column: 2 / 3;
      color: rgba(@cardTextColorMain, 0.7);
    }

    .icon-close,
    .icon_left {
      position: absolute;
      right: 0px;
      height: 35px;
      width: 35px;
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
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
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
