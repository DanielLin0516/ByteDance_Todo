<template>
  <div class="card-wrapper" @mousedown="columnsMouseMove" @wheel="columnsMouseWheel">
    <!-- 要渲染的卡片 -->
    <div
      class="card-item"
      v-for="column of store.state.lists"
      :key="column.id"
            draggable="true"
      @drop="moveTaskOrColumn($event, column.items, column.id, undefined)"
      @dragover.prevent
      @dragenter.prevent
      @dragstart.self="pickupColumn($event, column.id)"
    >
      <!-- 卡片标题 -->
      <div class="card-title">{{ column.listName }}</div>
      <!-- 卡片任务栏也要渲染 -->
      <div
        v-for="task of column.items"
        :key="task.cardId"
                draggable="true"
        @dragstart="pickupTask($event, task.cardId, column.id)"
        @dragover.prevent
        @dragenter.prevent
        @drop.stop="
          moveTaskOrColumn($event, column.items, task.cardId, column.id)
        "
      >
        <div class="card-menu">
          {{ task.cardname }}
          <div class="des">{{ task.description }}</div>
          <!-- <div v-if="task.time.timePeriod" :class="time" @click.prevent.stop="done">
            <div class="time1">
              <div>{{ task.time.timePeriod[0] }}</div>
              <div>{{ task.time.timePeriod[1] }}</div>
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
      <!-- 添加卡片按钮 -->
      <input
        class="new-button"
        type="text"
        placeholder="+ 添加任务"
        @keyup.enter="createTask($event, column.items)"
      />
    </div>
    <div class="btn-add">
      <input
        class="add-item"
        type="text"
        v-model="newColumnName"
        placeholder="添加另一个列表"
        @keyup.enter="createColumn"
      />
    </div>
    <div class="task-bg" v-if="isTaskOpen" @click.self="close">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import "animate.css";
import { getTimeStamp } from "../../store/utils";
import { IconPlus, IconSchedule } from "@arco-design/web-vue/es/icon";
import { computed, defineComponent, ref, TransitionGroup, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "MainCard",
  components: {
    IconPlus,
    TransitionGroup,
    IconSchedule,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const newColumnName = ref("");
    let cur = ref(true);
    const time = computed(() => {
      return {
        time: true,
        timedone: !cur.value,
      };
    });
    const done = () => {
      cur.value = !cur.value;
    };
    const isTaskOpen = computed(() => {
      return route.name === "task";
    });
    // 工具函数 获取当前column的name
    const getCurColumnName = (e: any) => {
      if (e.currentTarget.parentElement.className == "card-wrapper") {
        return e.currentTarget.firstElementChild.innerHTML;
      } else {
        return e.currentTarget.parentElement.firstElementChild.innerHTML;
      }
    };
    const goToTask = (task: { id: any }, columnID: string) => {
      router.push({ name: "task", params: { cid: columnID, id: task.id } });
    };
    const close = () => {
      router.push({ name: "Layout/Board" });
    };
    const createTask = (e: any, tasks: any) => {
      var timestamp = getTimeStamp();
      const curColumnName = getCurColumnName(e);
      const createAction = {
        username: "没想好叫啥",
        actionTime: timestamp,
        action: "在" + curColumnName + "中创建了这张卡",
      };
      store.commit("CREATE_TASK", {
        tasks,
        createAction,
        content: e.target.value,
      });
      e.target.value = "";
    };

    const createColumn = () => {
      store.commit("CREATE_COLUMN", {
        title: newColumnName.value,
      });
      newColumnName.value = "";
    };
    const pickupTask = (e: any, taskIndex: any, fromColumnIndex: any) => {
      e.dataTransfer.effctAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("from-task-index", taskIndex);
      e.dataTransfer.setData("from-column-index", fromColumnIndex);
      e.dataTransfer.setData("type", "task");
      e.dataTransfer.setData("from-column-name", getCurColumnName(e));
    };
    const pickupColumn = (e: any, fromColumnIndex: any) => {
      e.dataTransfer.effctAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("from-column-index", fromColumnIndex);
      e.dataTransfer.setData("type", "column");
    };
    const moveTaskOrColumn = (
      e: any,
      toTasks: any,
      toColumnIndex: any,
      toTaskIndex: any
    ) => {
      const type = e.dataTransfer.getData("type");
      if (type === "task") {
        moveTask(
          e,
          toTasks,
          toTaskIndex !== "undefined" ? toTaskIndex : toTasks.length
        );
      } else {
        moveColumn(e, toColumnIndex);
      }
    };
    const moveTask = (e: any, toTasks: any, toTaskIndex?: any) => {
      const fromColumnIndex = e.dataTransfer.getData("from-column-index");
      const fromTasks = store.state.lists[fromColumnIndex].items;
      const fromTaskIndex = e.dataTransfer.getData("from-task-index");
      const toTaskColumnName = getCurColumnName(e);
      const fromTaskColumnName = e.dataTransfer.getData("from-column-name");
      store.commit("MOVE_TASK", {
        fromTasks,
        fromTaskIndex,
        toTasks,
        toTaskIndex,
        toTaskColumnName,
        fromTaskColumnName,
      });
    };
    const moveColumn = (
      e: { dataTransfer: { getData: (arg0: string) => any } },
      toColumnIndex: any
    ) => {
      const fromColumnIndex = e.dataTransfer.getData("from-column-index");
      store.commit("MOVE_COLUMN", {
        fromColumnIndex,
        toColumnIndex,
      });
    };
    const height = (e: any) => {
      e.target.style.height = "4vw";
      e.target.style.border = "1px solid grey";
    };
    const height1 = (e: any) => {
      e.target.style.height = "10px";
      e.target.style.border = "";
    };
    const columnsMouseMove = (e: any) => {
      const el = e.target;

      const startPosition = e.clientX;
      const startScroll = el.parentElement.scrollLeft;

      if (!el.classList.contains("card-wrapper")) return;

      const onMouseMove = (e: any) => {
        const diff = e.clientX - startPosition;
        el.parentElement.scrollLeft = startScroll - diff;
      };
      const onMouseUp = () => {
        el.removeEventListener("mousemove", onMouseMove);
      };
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseup", onMouseUp);
    };
    const columnsMouseWheel = (e: any) => {
      const el = e.target;
      if (!el.classList.contains("card-wrapper")) return;

      const flag = ("" + e.deltaY)[0];
      let elP = el.parentElement;
      flag === "1" ? (elP.scrollLeft += 30) : (elP.scrollLeft -= 50);
    };
    return {
      store,
      isTaskOpen,
      goToTask,
      close,
      createTask,
      pickupTask,
      moveTask,
      pickupColumn,
      moveTaskOrColumn,
      newColumnName,
      createColumn,
      height,
      height1,
      time,
      done,
      columnsMouseMove,
      columnsMouseWheel,
    };
  },
});
</script>
<style lang="less" scoped>
@import url("./scrollCss/scroll.scss");
.card-wrapper {
  width: max-content;
  height: 100%;
  margin-top: 10px;
  .card-item {
    overflow-x: hidden;
    overflow-y: visible;
    max-height: 630px;
    width: 380px;
    float: left !important;
    flex-direction: column;
    // flex-shrink: 0;
    display: flex;
    margin-top: 5px;
    margin-left: 20px;
    margin-right: 20px;
    background-color: rgba(@cardColorWrapper, 1);
    border-radius: 10px;
    cursor: pointer;
    padding: 30px 20px 20px 20px;
    .card-title {
      cursor: pointer;
      width: 350px;
      height: 30px;
      opacity: 1;
      padding: 10px;
      font-size: 24px;
      font-family: PingFang-Bold-2;
    }
    .card-menu {
      height: auto;
      width: 350px;
      background-color: rgba(@cardColorMain, 1);
      padding: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      border-radius: 10px;
      box-shadow: 4px 2px 2px 1px rgba(@cardTextColorMain, 0.2);
      cursor: pointer;
      font-size: 24px;
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
      height: 10px;
      background-color: transparent;
      width: 370px;
      border-radius: 10px;
    }
  }

  .new-button {
    background-color: transparent;
    border: none;
    outline: 0;
    height: 30px;
    width: 350px;
    cursor: pointer;
    font-size: 24px;
    border-radius: 10px;
    padding: 10px;
  }
  .new-button:hover {
    background-color: rgba(@cardColorMain, 0.4);
  }

  .btn-add {
    float: left;
    .add-item {
      cursor: pointer;
      height: 50px;
      font-size: 24px;
      border-radius: 10px;
      padding: 10px;
      display: flex;
      align-items: center;
      width: 380px;
      background-color: rgba(@cardColorWrapper, 0.45);
      color: rgba(@cardTextColorSub, 1);
      margin-top: 5px;
      border: none;
      outline: 0;
    }
    .add-item:hover {
      background-color: rgba(@cardColorMain, 0.4);
    }
  }
  .task-bg {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0px;
    top: 0px;
    background-color: rgba(@cardTextColorMain, 0.45);
  }
}
</style>