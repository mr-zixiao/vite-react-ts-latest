//验证码响应
export interface CaptchaCodeRes {
  img: string;
  captchaEnabled: boolean;
  uuid: string;
}
//登录请求
export interface LoginReq {
  clientId?: string;
  password: string;
  username: string;
  [property: string]: any;
}
//登录响应
export interface LoginRes {
  access_token: string;
}
//用户信息响应
export interface UserInfoRes {
  searchValue: any;
  createBy: string;
  createTime: string;
  updateBy: any;
  updateTime: any;
  params: any;
  userId: number;
  deptId: number;
  userName: string;
  nickName: string;
  userType: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar: string;
  status: string;
  delFlag: string;
  loginIp: string;
  loginDate: string;
  remark: string;
  openid: any;
  idCard: any;
  dept: any;
  roles: any[];
  roleIds: any;
  postIds: any;
  roleId: any;
  postId: any;
  admin: boolean;
}
