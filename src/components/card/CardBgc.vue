<template>
  <div class="wrapper">
    <div class="creat-project">
      <span>改变标签颜色</span>
      <icon-close-circle class="icon-close" @click="closeBgc" />
      <div class="square" :style="{ background: upSquare }"></div>
      <div class="back-ground">
        <div class="content">背景</div>
        <div class="color-choose">
          <div
            class="choose"
            :class="{ active: choose.id === key }"
            :style="{ background: choose.color }"
            v-for="choose in color"
            :key="choose.id"
            @click="yourChoice(choose.color)"
          ></div>
        </div>
        <a-button
          type="primary"
          style="margin-top: 2vw; width: 100%; border-radius: 1vw; height: 3vw"
          @click="change"
          >更改</a-button
        >
      </div>
    </div>
  </div>
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
  IconCloseCircle,
} from "@arco-design/web-vue/es/icon";
import { defineComponent, reactive, ref, inject } from "vue";
import { useStore } from "vuex";
import CardColorLabel from "@/components/card/CardColorLabel.vue";
import TaskMember from "@/components/card/TaskMember.vue";
import CardBgc from "@/components/card/CardBgc.vue";
import { setCardColor } from "@/axios/api";
import { Message } from "@arco-design/web-vue";
export default defineComponent({
  components: {
    IconCloseCircle,
  },
  props: {
    lists: Object,
    id: String,
    columnName: String,
    bgc: Boolean,
  },
  emits: ["bgcShow", "change"],
  setup(props, context) {
    let upSquare = ref(String("#0079BF"));
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
      console.log(upSquare.value);
    };
    const closeBgc = () => {
      context.emit("bgcShow", !props.bgc);
    };
    const change = async () => {
      try {
        let obj = reactive({
          cardId: props.id,
          background: upSquare.value,
        });
        await setCardColor(props.id, upSquare.value.slice(1, 7));
        context.emit("change", obj);
        props.lists?.forEach((item: any) => {
          item.items.forEach((item1: any) => {
            if (props.id === item1.cardId) {
              item1.background = upSquare.value;
            }
          });
        });
        Message.success({ content: "变更成功" });
        context.emit("bgcShow", !props.bgc);
      } catch (error) {
        console.log(error);
      }
    };
    return {
      color,
      upSquare,
      yourChoice,
      closeBgc,
      change,
    };
  },
});
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 620px;
  padding: 20px;
  position: absolute;
  border-radius: 5px;
  top: -120px;
  right: -290px;
  background-color: rgba(@cardColorMain, 1);
  border-left: 1px solid rgba(@cardTextColorMain, 0.3);
  box-shadow: 0 8px 16px -4px rgb(9 30 66 / 25%), 0 0 0 1px rgb(9 30 66 / 8%);
  z-index: 10000;

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
  .icon-close {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    padding: 10px;
    color: rgba(@cardTextColorMain, 0.5);
    cursor: pointer;
    position: absolute;
    right: 0px;
    top: 0px;
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
        width: 96px;
        height: 30px;
        margin-right: 10px;
        border-radius: 10px;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .choose:hover {
        background-color: rgba(160, 124, 124, 0.3) !important;
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