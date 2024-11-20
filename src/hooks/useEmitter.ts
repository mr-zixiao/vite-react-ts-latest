import { ArgsProps } from "antd/es/message/interface";
import mitt from "mitt";

type Events = {
  message: ArgsProps;
  invalidToken: void;
};
export const emitter = mitt<Events>();
const useEmitter = () => emitter;
export default useEmitter;
