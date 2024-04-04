import { CREATE_LIST_MEET, GET_LIST_MEET, GET_LIST_USER } from "../const/api";
import { IRequestGetListMeeting } from "../interface/meeting";
import { IUser } from "../interface/user";
import httpServices from "./httpServices";
import queryString from "query-string";

class UserServices {
  getListUser(body: IRequestGetListMeeting) {
    return httpServices.get(`${GET_LIST_USER}?${queryString.stringify(body)}`);
  }
  postUser(body: IUser) {
    return httpServices.post(`${GET_LIST_USER}`, body);
  }
}

export default new UserServices();
