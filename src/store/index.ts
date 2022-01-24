import { createStore } from "vuex";
import defaultBoard from "./defaultBoard";
import { saveStatePlugins, uuid } from "./utils";
// const board = JSON.parse(localStorage.getItem('board')) || defaultBoard
export default createStore({
  plugins: [saveStatePlugins],
  state: {
    board: defaultBoard,
    userEvent:[],
    isCardDetailShow: false
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
      }
    }
  },
  mutations: {
    CREATE_TASK(state, { tasks, content }) {
      tasks.push({
        content,
        id:uuid(),
        description:''
      })
    },
    CREATE_COLUMN(state,{ title }) {
      state.board.columns.push({
        title,
        items:[]
      })
    },
    UPDATE_TASK(state,{task,key,value}) {
      task[key] = value;
    },
    MOVE_TASK(state,{fromTasks,toTasks,fromTaskIndex,toTaskIndex}) {
      const taskTOMove = fromTasks.splice(fromTaskIndex,1)[0];
      toTasks.splice(toTaskIndex,0,taskTOMove);
    },
    MOVE_COLUMN(state,{fromColumnIndex,toColumnIndex}) {
      const columnList = state.board.columns;
      const columnToMove = columnList.splice(fromColumnIndex,1)[0]
      columnList.splice(toColumnIndex, 0, columnToMove)
    },
    changeCardShowState(state) {
      state.isCardDetailShow = !state.isCardDetailShow
    }
  },
});
