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
export const deleteLabelApi = (id: number) => {
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

/**
 * 根据cardId设置对应的标签
 * @param newData:obj
 * @returns
 */
export const setTagByCardId = (cardId: string, tagId: string) => {
  return instance.post(`/tag/${tagId}/setTagByCardId/${cardId}`);
};

/**
 * 根据cardId与tagId删除对应的标签
 * @param cardId与tagId
 * @returns
 */
export const deleteTagInCard = (cardId: string, tagId: string) => {
  return instance.delete(`/tag/${tagId}/removeTagByCardId/${cardId}`);
};
