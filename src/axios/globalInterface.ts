
export interface ProductElement {
  background: string;
  createdTime: string;
  description: string;
  isPrivate: boolean;
  ownerId: string;
  productName: string;
  id: string;
}
export interface getInfo {
  cardId: number,
  cardname: string,
  description: string,
  listId: number,
  productId: number,
  closed: boolean,
  pos: number,
  deadline: string,
  tagList: Array<{}>,
  executorList: Array<{}>,
  begintime: string,
  expired: boolean
}
export interface getInfoLists {
  id: number,
  productId: number,
  pos: number,
  closed: boolean,
  listName: string,
  backgroundColor: string,
  createdTime: string
}