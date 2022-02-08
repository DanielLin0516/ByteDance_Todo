import { createStore } from "vuex";
import defaultBoard from "./defaultBoard";
import { ProductElement, StoreState, TagElement, UserElement, webLabel } from "@/axios/globalInterface";

export default createStore<StoreState>({
  state: {
    currentUserInfo: {
      avatar: "",
      fullname: "",
      userId: NaN,
      username: "",
    },
    isDark: false,
    productList: [],
    currentProductName: "",
    memberList: [],
    background: "",
    shareProductList: [],
    showInviteButton: false,
    userEvent: [],
    isCardDetailShow: false,
    tagList: [],
    labelList: [],
  },
  getters: {},
  mutations: {
    setIsDark(state, value: boolean) {
      state.isDark = value;
    },
    setCurrentUser(state, value: UserElement) {
      state.currentUserInfo = value;
    },
    setTagList(state, tagList: TagElement[]) {
      state.tagList = tagList;
    },
    setColor(state, value: string) {
      state.background = value;
    },
    setMemberList(state, value: UserElement[]) {
      state.memberList = value;
    },
    setProductList(state, value: ProductElement[]) {
      state.productList = value;
    },
    setShareProductList(state, value: ProductElement[]) {
      state.shareProductList = value;
    },
    setShowInviteButton(state, value: boolean) {
      state.showInviteButton = value;
    },
    setCurrentProductName(state, value: string) {
      state.currentProductName = value;
    },
    setLabelList(state, list: webLabel[]) {
      state.labelList = list;
    },
    changeCardShowState(state) {
      state.isCardDetailShow = !state.isCardDetailShow;
    },
    addNewLabel(state, newTag: TagElement) {
      state.labelList.push(newTag);
    },
  },
});
