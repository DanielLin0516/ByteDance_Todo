import instance from './request';
export function getUser(obj: { username: String; password: String }): Promise<{ token: String ,userId:number}> {
  return instance.post(`/login?username=${obj.username}&password=${obj.password}`)
}
export function registerUser(obj: {
  fullname: String;
  username: String;
  verifyCode: String;
  password: String
}) {
  return instance.post(`/register`, obj)
}
export function currentUser():Promise<{userId:number,fullname:String}> {
  return instance.get(`/users/currentUser`)
}
export function getProduct():Promise<{productList: Array<{}>,shareProductList:Array<{}>}>{
  return instance.get(`/product/getPersonProduct`)
}
export function createProduct(obj:{
  background: String;
  description: String;
  isPrivate: Boolean;
  ownerId: Number;
  productName: String;
}):Promise<{id:number}>{
  return instance.post(`/product/create`,obj)
}
export function sendEmail(email:String) {
  return instance.post(`/mail/sendVerifyCodeToMail?actionType=register&email=${email}`)
}
export function deleteProject(id:any) {
  return instance.delete(`/product/delete?id=${id}`)
}
