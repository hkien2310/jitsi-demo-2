//* Common interface
export interface List<T> extends Array<T> {
  [index: number]: T;
}

export interface ResponseGenerator<T = any> {
  config?: any;
  data?: T;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
}

export interface SelectOption {
  label: string;
  value: any;
}

export type SetOptionsValue = React.Dispatch<React.SetStateAction<SelectOption[]>>;
export type SetBooleanState = React.Dispatch<React.SetStateAction<boolean>>;

export interface ResponsePagination<T> {
  data: T;
  totalPage: number;
  totalRecord: number;
  message: string;
  status?: number;
}

export enum LinkP {
  LOGIN = "Đăng nhập",
  LOGOUT = "Đăng xuất",

  SELL = "Bán hàng",
  PRODUCT = "Sản phẩm",
  ORDERSELL = "Đơn bán hàng",
  ORDER = "Đơn hàng",
  NEEDBILL = "Cần xuất hoá đơn",
  REPORT = "Báo cáo",
  CONFIG = "Cấu hình",
  QUOTE = "Báo giá",
  TEAM = "Nhân viên",
  CUSTOMER = "Khách hàng",
  WAREHOUSE = "Kho",
  INWARDNOTE = "Phiếu nhập kho",
  OUTWARDNOTE = "Phiếu xuất kho",
  BUSINESSMAN = "Nhân viên kinh doanh",
}

export interface RouteP {
  path?: string;
  exact?: boolean;
  component: React.FC;
  name: string;
  isPrivate?: boolean;
}

export interface Tablist {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

export interface SelectOption {
  label: string;
  value: any;
}
