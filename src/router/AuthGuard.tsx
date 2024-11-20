import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmitter, useSleep } from "@/hooks";
import { useAppSelector } from "@/store";

interface Props {
  children: React.ReactNode;
}
function AuthGuard(props: Props) {
  const emitter = useEmitter();
  const navigate = useNavigate();
  const { sleep, cancel } = useSleep(500);
  const token = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    emitter.on("invalidToken", () => {
      navigate("/login");
    });
    return () => {
      emitter.off("invalidToken");
    };
  }, []);
  useEffect(() => {
    if (token === undefined) {
      sleep().finally(() => {
        emitter.emit("message", {
          content: "登录已过期，即将前往登录页面",
          type: "error",
          onClose: () => {
            navigate("/login");
          },
        });
      });
    }
    return cancel;
  }, [token]);
  return <>{token ? props.children : "invalidToken"}</>;
}
export default AuthGuard;
