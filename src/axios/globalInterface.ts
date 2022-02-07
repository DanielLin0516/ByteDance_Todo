/**
 * store类型
 */
export interface Store {
  currentUserInfo: UserElement;
  productList: ProductElement[];
  currentProductName: string;
  memberList: UserElement[];
  background: string;
  shareProductList: ProductElement[];
  showInviteButton: boolean;
  userEvent: Array<any>;
  isCardDetailShow: boolean;
  tagList: TagElement[];
  labelList: webLabel[];
}
/**
 * 项目类型
 */
export interface ProductElement {
  background: string;
  createdTime: string;
  description: string;
  isPrivate: boolean;
  ownerId: string;
  productName: string;
  id: string;
}

export interface TagElement {
  color: string;
  id: number;
  productId: number;
  tagName: string;
}

export interface UserElement {
  avatar: string;
  fullname: string;
  userId: number;
  username: string;
}

export interface CardElement {
  begintime: string;
  cardId: number;
  cardname: string;
  closed: boolean;
  deadline: string;
  description: string;
  executorList: UserElement[];
  expired: boolean;
  listId: number;
  pos: number;
  productId: number;
  tagList: TagElement[];
  createdTime: string;
  creator: UserElement;
  background: string;
  completed: boolean;
  action: Array<any>;
}

export interface ListElement {
  closed: boolean;
  id: number;
  listName: string;
  pos: number;
  productId: number;
}

/**
 * 项目中渲染用到的初始列元素
 */
export interface ProductShowElement {
  listName: string;
  listId: number;
  productId: number;
  closed: boolean;
  pos: number;
  items: CardElement[];
}

export interface LabelElement {
  color: string;
  id: string;
  productId: string;
  tagName: string;
}

export interface webLabel extends LabelElement {
  show: boolean;
  isChoosed: boolean;
}
