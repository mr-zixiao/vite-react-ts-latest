import React from "react";
import { px2remTransformer, StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import MessageProvider from "@/context/Message.tsx";

interface Props {
  children: React.ReactNode;
}

const px2rem = px2remTransformer({
  rootValue: 16, // 32px = 1rem; @default 16
  precision: 5,
  mediaQuery: false,
});
dayjs.locale("zh-cn");

function AntdProvider(props: Props) {
  return (
    <ConfigProvider locale={zhCN}>
      <StyleProvider transformers={[px2rem]}>
        <MessageProvider>{props.children}</MessageProvider>
      </StyleProvider>
    </ConfigProvider>
  );
}

export default AntdProvider;
