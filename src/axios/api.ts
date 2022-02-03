import {
  ProductElement,
  ProductShowElement,
  CardElement,
  UserElement,
  TagElement,
  ListElement,
} from "@/axios/globalInterface";
import instance from "./request";
/**
 * 登录
 * @param obj
 * @returns
 */
export function getUser(obj: {
  username: String;
  password: String;
}): Promise<{ token: string; userId: number }> {
  return instance.post(
    `/login?username=${obj.username}&password=${obj.password}`
  );
}

/**
 * 注册用户
 * @param obj
 * @returns
 */
export function registerUser(obj: {
  fullname: String;
  username: String;
  verifyCode: String;
  password: String;
}) {
  return instance.post(`/register`, obj);
}

/**
 * 根据token查询当前用户
 * @returns
 */
export function currentUser(): Promise<{ userId: number; fullname: String }> {
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
export function createProduct(obj: {
  background: String;
  description: String;
  isPrivate: Boolean;
  ownerId: Number;
  productName: String;
}): Promise<{ id: number }> {
  return instance.post(`/product/create`, obj);
}

/**
 * 发送邮件
 * @param email
 * @returns
 */
export function sendEmail(email: String) {
  return instance.post(
    `/mail/sendVerifyCodeToMail?actionType=register&email=${email}`
  );
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
