<template>
  <div>
    <div class="card-menu">
      <div
        class="top-color"
        :style="{ background: cardInfo.background }"
        v-show="cardInfo?.background"
      ></div>
      {{ cardInfo?.cardname }}
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
import { defineComponent, inject, computed } from "vue";
import { CardElement } from "@/axios/globalInterface";
import { taskComplete } from "@/axios/api";
import { Message } from "@arco-design/web-vue";
export default defineComponent({
  name: "CardItem",
  components: {
    IconSchedule,
  },
  props: {
    cardInfo: Object,
    columnId: String,
    lists: Array,
  },
  setup(props) {
    const done = async (Info) => {
      try {
        await taskComplete(Info.cardId, !Info.completed);
        Info.completed = !Info.completed;
      } catch (error) {
        console.trace(error);
      }

      // props.lists.forEach((item) => {
      //   item.items.forEach((item1) => {
      //     if (Info.carId === item1.cardId) {
      //       item1.completed = !Info.completed;
      //     }
      //   })
      // })
    };
    return {
      dayjs,
      done,
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
    width: 150px;
    align-items: center;
    background-color: rgb(242, 214, 0);
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
      margin-left: 5px;
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
