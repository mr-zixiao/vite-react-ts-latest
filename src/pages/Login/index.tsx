import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { ApiAuth } from "@/services/api";
import { setToken, setUserInfo } from "@/store/auth.ts";
import { LoginReq } from "@/services/api/auth/dto";
import { useMessage } from "@/context/Message.tsx";

function Login() {
  const token = useAppSelector((state) => state.auth.token);
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const message = useMessage();
  const navigate = useNavigate();
  const handleLogin = (data: LoginReq) => {
    ApiAuth.login(data)
      .then((resp) => {
        if (resp.code == 200) {
          dispatch(setToken(resp.data.access_token));
          return ApiAuth.getUserInfo();
        }
      })
      .then((resp) => {
        if (resp?.code == 200) {
          dispatch(setUserInfo(resp.data));
          message.show({
            content: "登录成功",
            type: "success",
          });
          navigate("/");
        }
      });
  };
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          handleLogin({
            username: formData.get("username") as string,
            password: formData.get("password") as string,
          });
        }}
      >
        <div>
          <label htmlFor="username">用户名</label>
          <input type="text" name="username" id="username" />
        </div>
        <div>
          <label htmlFor="password">密码</label>
          <input type="password" name="password" id="password" />
        </div>
        <div>
          <button type="submit">登录</button>
        </div>
        <p>{token}</p>
        <p>{JSON.stringify(userInfo)}</p>
      </form>
    </div>
  );
}

export default Login;
