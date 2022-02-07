import { ProductElement, ProductShowElement, CardElement, UserElement, TagElement, ListElement } from "@/axios/globalInterface";
import instance from "./request";
/**
 * 登录
 * @param obj
 * @returns
 */
export function getUser(obj: { username: String; password: String }): Promise<{ token: string; userId: number }> {
  return instance.post(`/login?username=${obj.username}&password=${obj.password}`);
}

/**
 * 注册用户
 * @param obj
 * @returns
 */
export function registerUser(obj: { fullname: String; username: String; verifyCode: String; password: String }) {
  return instance.post(`/register`, obj);
}

/**
 * 根据token查询当前用户
 * @returns
 */
export function currentUser(): Promise<{
  userId: number;
  fullname: String;
  username: String;
}> {
  return instance.get(`/users/currentUser`);
}

/**
 * 获取个人创建以及参与的项目
 * @returns
 */
export function getProduct(): Promise<{
  productList: ProductElement[];
  shareProductList: ProductElement[];
}> {
  return instance.get(`/product/getPersonProduct`);
}

/**
 * 创建项目
 * @param obj
 * @returns
 */
export function createProduct(obj: { background: String; description: String; isPrivate: Boolean; ownerId: Number; productName: String }): Promise<{ id: number }> {
  return instance.post(`/product/create`, obj);
}

/**
 * 发送注册邮件
 * @param email
 * @returns
 */
export function sendEmail(email: String) {
  return instance.post(`/mail/sendVerifyCodeToMail?actionType=register&email=${email}`);
}
/**
 * 发送重置密码邮件
 * @param email
 * @returns
 */
export function sendResetEmail(email: String) {
  return instance.post(`/mail/sendVerifyCodeToMail?actionType=reset&email=${email}`);
}
/**
 * 重置密码
 * @param email
 * @returns
 */
export function modifyUserPassWord(obj: { password: string; username: string; verifyCode: string }) {
  return instance.post(`/users/modifyUserPassWord`, obj);
}

/**
 * 删除项目
 * @param id
 * @returns
 */
export function deleteProject(id: String) {
  return instance.delete(`/product/delete?id=${id}`);
}

/**
 * 获取页面信息
 * @param productId
 * @returns
 */

export function getProductInfo(productId: any): Promise<{
  cardList: CardElement[];
  lists: ListElement[];
  background: string;
  isPrivate: string;
  createdTime: string;
  memberList: UserElement[];
  productName: string;
  tagList: TagElement[];
}> {
  return instance.get(`/product/getProductShowInfo/${productId}`);
}

/**
 * 获取是否是自己创建的项目
 * @param productId
 * @returns
 */
export function owner(productId: any): Promise<{ isOwner: boolean }> {
  return instance.get(`/product/getMemberStatus/${productId}`);
}

/**
 *
 * @param param 创建列
 * @returns
 */
export function createList(param: { listName: string; pos: number; productId: number }): Promise<ListElement> {
  return instance.post("/list/addList", param);
}

/**
 * 修改列的名称
 * @param listId
 * @param listNName
 * @returns
 */
export function editListName(listId: number, listNName: string): Promise<any> {
  return instance.post(`/list/editListName?listId=${listId}&listName=${listNName}`);
}

/**
 * 获取卡片信息
 * @param cardId
 * @returns
 */
export function getCardInfo(cardId: number): Promise<{
  cardList: CardElement[];
  lists: ListElement[];
  background: string;
  isPrivate: string;
  createdTime: string;
  memberList: UserElement[];
  productName: string;
  tagList: TagElement[];
  cardname: string;
  description: string;
}> {
  return instance.get(`/cards/queryById/${cardId}`);
}

/**
 * 获取项目内的label
 * @param  productId
 * @returns
 */

export const getTagsByProductId = (productId: string): Promise<{ data: any }> => {
  return instance.get(`/tag/getTagsByProductId??productId=${productId}`);
};

/**
 * project中添加新label
 * @param newLabelData
 * @returns
 */
export function createNewLabel(newLabelData: { color: string; productId: string; content: string }): Promise<{ id: string; productId: string; tagName: string; color: string }> {
  return instance.post(`/tag/create`, newLabelData);
}

/**
 * 根据id删除列
 * @param listId
 * @returns
 */
export function deleteListById(listId: number): Promise<any> {
  return instance.delete(`/list/removeList/${listId}`);
}

/**
 * 移动列
 * @param param
 * @returns
 */
export function moveList(param: { listId: number; pos: number }): Promise<any> {
  return instance.post("/list/moveList", param);
}
/**
 * 获取邀请码
 * @param userId
 * @returns
 */
export function getInviteCode(userId: any): Promise<any> {
  return instance.get(`/users/getInviteCode/${userId}`);
}
/**
 * 邀请页
 * @param productId
 * @param inviteCode
 * @returns
 */
export function inviteShow(
  productId: any,
  inviteCode: any
): Promise<{
  tokenExpire: boolean;
  productName: string;
  inviteUserName: string;
}> {
  return instance.get(`/product/getInviteInfo?productId=${productId}&secret=${inviteCode}`);
}

/**
 * --column中添加新card
 * @param newCardData
 * @returns
 */
export function createNewCard(newCardData: { cardname: string; listId: number; pos: number; productId: number }): Promise<{
  begintime: string;
  cardId: number;
  cardname: string;
  closed: boolean;
  createdTime: string;
  deadline: string;
  description: string;
  expired: boolean;
  listId: number;
  pos: number;
  productId: number;
}> {
  return instance.post(`/cards/create`, newCardData);
}
/**
 * 邀请人员加入项目
 * @param obj
 * @returns
 */
export function invitePerson(obj: { productId: number; secret: string; userId: number }): Promise<{}> {
  return instance.post(`/product/invite`, obj);
}

/**
 * 移动卡片
 * @param param
 * @returns
 */
export function moveCard(param: { cardId: number; listId: number; pos: number }): Promise<any> {
  return instance.post("/cards/moveCard", param);
}
/**
 * 更改背景
 * @param productId
 * @param bgc
 * @returns
 */
export function changeBackground(productId: number, bgc: string): Promise<{}> {
  return instance.post(`/product/setProductBackground/${productId}?background=${bgc}`);
}
/**
 * 编辑卡片标题
 * @param cardId
 * @param editContent
 * @returns
 */
export function editCardName(cardId: number, editContent: string) {
  return instance.post(`/cards/editCardNameByCardId/${cardId}`, { editContent });
}
/**
 * 编辑卡片描述
 * @param cardId
 * @param editContent
 * @returns
 */
export function editCardDesc(cardId: number, editContent: string) {
  return instance.post(`/cards/editDescByCardId/${cardId}`, { editContent });
}
/**
 * 设置项目执行时间
 * @param productId
 * @param bgc
 * @returns
 */
export function setTime(
  cardId: number,
  obj: {
    beginTime: string;
    deadline: string;
    dueReminder?: any;
  }
): Promise<{}> {
  return instance.post(`/cards/setCardDeadline/${cardId}`, obj);
}
/**
 * 根据ID删除卡片
 * @param cardId
 * @returns
 */
export function removeCard(cardId: number) {
  return instance.delete(`/cards/removeCardById/${cardId}`);
}
/**
 * 根据ID删除卡片
 * @param cardId
 * @param color
 * @returns
 */
export function setCardColor(cardId: number,color:string) {
  return instance.post(`/cards/setCardBackground/${cardId}?background=${color}`);
}
/**
 * 根据ID删除卡片
 * @param cardId
 * @param complete
 * @returns
 */
export function taskComplete(cardId: number,complete:boolean) {
  return instance.post(`/cards/changeCardCompleteStatus/${cardId}?completed=${complete}`);
}
