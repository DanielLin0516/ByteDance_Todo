import instance from './request'
export function getUser(obj: { username: String; password: String }): Promise<{ token: String }> {
  return instance.post(`/login?username=${obj.username}&password=${obj.password}`)
}
export function registerUser(obj: {
  fullname: String,
  username: String,
  verifyCode: String,
  password: String
}) {
  return instance.post(`/register`, obj)
}
