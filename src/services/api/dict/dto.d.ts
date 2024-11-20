interface DictItem {
  searchValue?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  params?: unknown;
  dictCode?: number;
  dictSort?: number;
  dictLabel?: string;
  dictValue?: string;
  dictType?: string;
  cssClass?: string;
  listClass?: string;
  isDefault?: string;
  status?: string;
  remark?: string;
  default?: boolean;
}
// 字典响应
export type DictRes = DictItem[];
