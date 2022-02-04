<template>
  <div
    draggable="true"
    @dragstart="pickupTask"
    @dragover.prevent
    @dragenter.prevent
    @drop.stop="moveTask($event)"
  >
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
    <div
      class="kanban-dropzon"
      @dragover.prevent="height($event)"
      @dragleave.prevent="height1($event)"
      @drop="height1($event)"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "CardItem",
  components: {},
  props: {
    cardInfo: Object,
    columnId: String,
  },
  // emits: ["loadingOver"],
  setup(props) {
    const height = (e: any) => {
      e.target.style.height = "4vw";
      e.target.style.border = "1px solid grey";
    };
    const height1 = (e: any) => {
      e.target.style.height = "10px";
      e.target.style.border = "";
    };
    const pickupTask = (e: any) => {
      console.log(e);
    };
    const moveTask = (e: any) => {
      console.log(e);
    };
    return {
      height,
      height1,
      pickupTask,
      moveTask,
    };
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
  border-radius: 10px;
  box-shadow: 4px 2px 2px 1px rgba(@cardTextColorMain, 0.2);
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
.kanban-dropzon {
  height: 8px;
  background-color: transparent;
  border-radius: 10px;
}
</style>