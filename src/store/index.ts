import { createStore } from "vuex";

export default createStore({
  state: {
    count: 10,
  },
  mutations: {
    add(state) {
      state.count++;
    },
  },
});
