import { CREATE_LIST_MEET, DELETE_MEET, GET_LIST_MEET } from "../const/api";
import { IRequestGetListMeeting } from "../interface/meeting";
import httpServices from "./httpServices";
import queryString from "query-string";

class MeetingServices {
  getListMeeting(body: IRequestGetListMeeting) {
    return httpServices.get(`${GET_LIST_MEET}?${queryString.stringify(body)}`);
    // return httpServices.get(`${GET_LIST_MEET}`);
  };
  createMeeting(body: any) {
    return httpServices.post(`${CREATE_LIST_MEET}`, body);
  }
  deleteMeeting(id: number){
    return httpServices.delete(`${DELETE_MEET}${id}`)
  }
  updateMeeting(id: number, body: any){
    return httpServices.patch(`${CREATE_LIST_MEET}/${id}`, body)
  }

}

export default new MeetingServices();