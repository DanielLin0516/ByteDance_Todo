import { createStore } from "vuex";
import defaultBoard from "./defaultBoard";
import { saveStatePlugins, uuid, timetrans, getTimeStamp } from "@/utils/utils";
// const board = JSON.parse(localStorage.getItem('board')) || defaultBoard
export default createStore({
  plugins: [saveStatePlugins],
  state() {
    return {
      userId: "",
      productList: [],
      currentProductName: "",
      memberList: [],
      background: "",
      shareProductList: [],
      showInviteButton: false,
      board: defaultBoard,
      userEvent: [],
      isCardDetailShow: false,
      show: false,
      tagList: [],
      fullName: "",
      email: "",
      labelList: [],
    };
  },
  getters: {
    getTask(state) {
      return (id: any) => {
        for (const column of state.board.columns) {
          for (const task of column.items) {
            if (task.id === id) {
              return task;
            }
          }
        }
      };
    },
    getColumnName(state) {
      return (cid: any) => {
        for (const column of state.board.columns) {
          if (column.id == cid) {
            return column.title;
          }
        }
      };
    },
  },
  mutations: {
    setTagList(state, tagList) {
      state.tagList = tagList;
    },
    fullName(state, value) {
      state.fullName = value;
    },
    Email(state, value) {
      state.email = value;
    },
    setColor(state, value) {
      state.background = value;
    },
    setMemberList(state, value) {
      state.memberList = value;
    },
    setUserId(state, value) {
      state.userId = value;
    },
    setProductList(state, value) {
      state.productList = value;
    },
    setShareProductList(state, value) {
      state.shareProductList = value;
    },
    setShowInviteButton(state, value) {
      state.showInviteButton = value;
    },
    setCurrentProductName(state, value) {
      state.currentProductName = value;
    },
    setLabelList(state, list) {
      state.labelList = list;
    },
    CREATE_TASK(state, { tasks, createAction, content }) {
      createAction.actionTime = timetrans(createAction.actionTime);
      tasks.push({
        content,
        id: uuid(),
        description: "",
        actions: [createAction],
        time: {
          done: false,
          timePeriod: "",
        },
      });
    },
    UPDATE_TASK(state, { task, key, value }) {
      task[key] = value;
    },
    MOVE_TASK(state, { fromTasks, toTasks, fromTaskIndex, toTaskIndex, toTaskColumnName, fromTaskColumnName }) {
      const taskTOMove = fromTasks.splice(fromTaskIndex, 1)[0];
      const moveAction = {
        username: "没想好叫啥",
        action: "把任务卡从" + fromTaskColumnName + "移动到" + toTaskColumnName,
        actionTime: timetrans(getTimeStamp()),
      };
      if (fromTaskColumnName != toTaskColumnName) {
        taskTOMove.actions.unshift(moveAction);
      }
      toTasks.splice(toTaskIndex, 0, taskTOMove);
    },
    changeCardShowState(state) {
      state.isCardDetailShow = !state.isCardDetailShow;
    },
  },
});
