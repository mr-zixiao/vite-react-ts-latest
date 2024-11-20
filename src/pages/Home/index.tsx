import { Link } from "react-router-dom";
import { useCallback } from "react";
import { ApiAuth } from "@/services/api";
import { useAppDispatch } from "@/store";
import { logout, setToken } from "@/store/auth.ts";

function Home() {
  const dispatch = useAppDispatch();

  const onButtonClick = useCallback(() => {
    ApiAuth.getUserInfo();
  }, []);
  return (
    <div>
      <h1>Home页面</h1>
      <Link to={"/about"}>about</Link>
      <button onClick={onButtonClick}>请求用户信息</button>
      <button
        onClick={() => {
          dispatch(setToken("asdadasdasd"));
        }}
      >
        篡改token
      </button>
      <button
        onClick={() => {
          dispatch(logout());
        }}
      >
        清除token
      </button>
    </div>
  );
}
export default Home;
