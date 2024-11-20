import React, { useEffect } from "react";
import { ArgsProps } from "antd/es/message/interface";
import { message } from "antd";
import useEmitter from "@/hooks/useEmitter.ts";

export interface IMessageContext {
  show: (args: ArgsProps) => void;
}

interface MessageProps {
  children: React.ReactNode;
}

const MessageContext = React.createContext<IMessageContext | null>(null);
export const useMessage = () => {
  const context = React.useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};

function MessageProvider(props: MessageProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const emitter = useEmitter();
  const show = (args: ArgsProps) => messageApi.open(args);
  useEffect(() => {
    emitter.on("message", (args: ArgsProps) => show(args));
    return () => {
      emitter.off("message");
    };
  }, []);
  return (
    <MessageContext.Provider value={{ show }}>
      {contextHolder}
      {props.children}
    </MessageContext.Provider>
  );
}

export default MessageProvider;
