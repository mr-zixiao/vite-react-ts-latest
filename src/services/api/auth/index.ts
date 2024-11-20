import type { CaptchaCodeRes, LoginReq, LoginRes, UserInfoRes } from "./dto";
import request from "@/services/axios";

const getCaptchaCode = () => {
  return request.data<CaptchaCodeRes>({
    url: "/code?r=255&g=255&b=255",
    method: "get",
  });
};

const login = (data: LoginReq) => {
  return request.data<LoginRes>({
    url: "/auth/login",
    method: "post",
    data,
  });
};

const getUserInfo = () => {
  return request.data<UserInfoRes>({
    url: "/system/user/getInfo",
    method: "get",
  });
};
// 退出登录
const logout = () => {
  return request.data({
    url: "/auth/logout",
    method: "delete",
  });
};

export default {
  login,
  getUserInfo,
  logout,
  getCaptchaCode,
};
