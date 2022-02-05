<template>
  <div>
    <div class="card-menu">
      {{ cardInfo?.cardname }}
      <div class="des">{{ cardInfo?.description }}</div>
      <!-- <div v-if="cardInfo.time.timePeriod" :class="time" @click.prevent.stop="done">
            <div class="time1">
              <div>{{ cardInfo.time.timePeriod[0] }}</div>
              <div>{{ cardInfo.time.timePeriod[1] }}</div>
            </div>
            <icon-schedule class="time2" />
          </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CardElement } from "@/axios/globalInterface";
export default defineComponent({
  name: "CardItem",
  components: {},
  props: {
    cardInfo: Object,
    columnId: String,
  },
  setup(props) {
    return {};
  },
});
</script>

<style lang="less" scoped>
.card-menu {
  height: auto;
  // width: 100%;
  background-color: rgba(@cardColorMain, 1);
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 8px;
  border-radius: 10px;
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
    width: 200px;
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
}
.card-menu:hover {
  background-color: rgba(@cardColorMain, 0.45);
}
</style>
