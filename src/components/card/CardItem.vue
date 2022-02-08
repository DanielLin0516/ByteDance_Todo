<template>
  <div>
    <div class="card-menu">
      <div
        class="top-color"
        :style="{ background: cardInfo.background }"
        v-show="cardInfo?.background"
      ></div>
      <div
        v-show="cardInfo.tagList[0]"
        class="tag_content"
        :class="{ after_click_tags: isTagClick }"
        @mouseover="tagMouseOver($event)"
        @mouseout="tagMouseOut"
        @click="clickTag($event)"
      >
        <span
          class="tag_item"
          :class="{ hoverEffect: isTagHover }"
          v-for="(item, index) of cardInfo.tagList"
          :key="index"
          :style="{ backgroundColor: item.color }"
          :title="item.tagName"
        >
          <span v-show="isTagClick">{{ item.tagName }}</span>
        </span>
      </div>
      {{ cardInfo.cardname }}
      <div class="des">{{ cardInfo?.description }}</div>
      <div
        class="time"
        :class="{ timedone: cardInfo.completed }"
        v-show="cardInfo?.begintime"
        @click.stop="done(cardInfo)"
      >
        <div>
          <div>{{ dayjs(cardInfo?.begintime).format("YYYY-MM-DD") }}</div>
          <div>{{ dayjs(cardInfo?.deadline).format("YYYY-MM-DD") }}</div>
        </div>
        <icon-schedule class="time2" />
      </div>
      <div class="member_content" v-if="cardInfo?.executorList[0]">
        <div class="member_items">
          <a
            class="member_item"
            v-for="(user, index) in cardInfo?.executorList"
            :key="user.userId + index"
            :title="user.fullname"
          >
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import dayjs from "dayjs";
import { IconSchedule } from "@arco-design/web-vue/es/icon";
import { defineComponent, ref, PropType } from "vue";
import { CardElement } from "@/axios/globalInterface";
import { taskComplete } from "@/axios/api";
import { Message } from "@arco-design/web-vue";
export default defineComponent({
  name: "CardItem",
  components: {
    IconSchedule,
  },
  props: {
    cardInfo: {
      type: Object as PropType<CardElement>,
      required: true,
    },
    columnId: String,
    lists: Array,
  },
  setup(props) {
    const isTagHover = ref(false);
    const isTagClick = ref(false);
    const done = async (Info: CardElement) => {
      try {
        await taskComplete(Info.cardId, !Info.completed);
        if (!Info.completed === true) {
          Message.success({ content: "任务已经完成" });
        } else {
          Message.warning({ content: "任务未完成" });
        }
        Info.completed = !Info.completed;
      } catch (error) {
        console.trace(error);
      }
    };

    /**
     * Over跟out可以作用于子元素，类似事件委托
     */
    const tagMouseOver = (e: MouseEvent) => {
      const el: HTMLDivElement = e.target as HTMLDivElement;
      //判断是否在父元素上
      if (el.classList.contains("tag_content")) return;
      //已经点击展开则不再显示hover效果
      if (isTagClick.value) return;
      isTagHover.value = true;
    };
    const tagMouseOut = () => (isTagHover.value = false);

    const clickTag = (e: MouseEvent) => {
      //事件委托，但是需要判断点击的是否为子元素
      const el: HTMLDivElement = e.target as HTMLDivElement;

      //判断点击的是否为子元素
      if (el.classList.contains("tag_content")) return;

      //阻止冒泡
      e.stopPropagation();
      console.log("点击了子元素----");
      isTagHover.value = false;
      isTagClick.value = !isTagClick.value;
    };

    return {
      dayjs,
      isTagHover,
      isTagClick,

      done,
      tagMouseOver,
      tagMouseOut,
      clickTag,
    };
  },
});
</script>

<style lang="less" scoped>
.card-menu {
  overflow: hidden;
  .top-color {
    height: 40px;
    width: 300px;
    border-radius: 5px;
    margin-bottom: 5px;
    margin-left: -15px;
    margin-top: -10px;
  }
  height: auto;
  // width: 100%;
  background-color: rgba(@cardColorMain, 1);
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 8px;
  border-radius: 10px;
  color: rgba(@cardTextColorMain, 0.8);
  box-shadow: 0 1px 2px 1px rgba(@cardTextColorMain, 0.2);
  cursor: pointer;
  font-size: 18px;
  border-bottom: 2px solid rgba(@cardTextColorSub, 0.45);
  .tag_content {
    // display: grid;
    // grid-template-columns: repeat(5, 1fr);
    // grid-gap: 3px;
    // grid-auto-rows: minmax(1px, auto);
    // justify-items: center;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;

    .tag_item {
      position: relative;
      flex: 0 0 30%;
      margin-left: 2%;
      width: 20%;
      height: 10px;
      border-radius: 5px;
      margin-bottom: 5px;
    }
    .hoverEffect {
      &::before {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  .after_click_tags {
    .tag_item {
      position: relative;
      height: 20px;
      min-width: 15%;
      line-height: 20px;
      border-radius: 5px;
      // flex: 0 0 20%;
      padding: 3px 5px;
    }
  }
  .des {
    font-size: 12px;
    color: rgba(@cardTextColorMain, 0.5);
    margin-top: 5px;
    font-style: italic;
  }
  .time {
    margin-top: 10px;
    display: flex;
    font-size: 12px;
    width: fit-content;
    align-items: center;
    background-color: rgb(242, 214, 0);
    justify-content: space-between;
    padding: 5px;
    border-radius: 10px;
    color: rgba(@cardColorMain, 1);
    .time1 {
      display: flex;
      flex-direction: column;
    }
    .time2 {
      height: 30px;
      width: 30px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .time:hover {
    background-color: rgb(217, 181, 28);
  }
  .timedone {
    background-color: rgb(97, 189, 79);
  }
  .timedone:hover {
    background-color: rgb(81, 152, 57);
  }

  .member_content {
    position: relative;
    right: 5px;
    display: flex;
    justify-content: flex-end;
    .member_items {
      display: flex;
      .member_item {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;
        // margin-top: 10px;
        border-radius: 50%;
        user-select: none;

        font-weight: 1000;

        background: url(https://joeschmoe.io/api/v1/random);
        background-color: rgba(0, 0, 0, 0.1);

        &:hover {
          transform: scale(1.04);
          background-color: rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      }
    }
  }
}
.card-menu:hover {
  background-color: rgba(@cardColorMain, 0.45);
}
</style>
