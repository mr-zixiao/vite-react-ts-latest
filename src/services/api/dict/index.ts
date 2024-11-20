import { DictRes } from "./dto";
import request from "@/services/axios";

const getDictByType = (dictType: string) => {
  return request.data<DictRes>({
    url: "/system/dict/data/type/" + dictType,
    method: "get",
  });
};
export default {
  getDictByType,
};
