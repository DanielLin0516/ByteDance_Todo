import instance from "./request";
import { LabelElement } from "./globalInterface";

/**
 * 获取项目内的label
 * @param  productId
 * @returns
 */

export const getTagsByProductId = (productId: string): Promise<LabelElement[]> => {
  return instance.get(`/tag/getTagsByProductId?productId=${productId}`);
};

/**
 * project中添加新label
 * @param newLabelData
 * @returns
 */
export const createNewLabel = (newLabelData: { color: string; productId: number; tagName: string }): Promise<LabelElement> => {
  return instance.post(`/tag/create`, newLabelData);
};

/**
 * 根据id删除对应的标签
 * @param id:number~
 * @returns
 */
export const deleteLabelById = (id: number) => {
  return instance.delete(`/tag/removeTagById/${id}`);
};

/**
 * 编辑label
 * @param newData:obj
 * @returns
 */

export const editLabelApi = (newData: object) => {
  return instance.post("/tag/modify", newData);
};
