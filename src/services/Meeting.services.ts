import { ADD_MEETING_NOTE, CREATE_LIST_MEET, GET_LIST_MEET, GET_LIST_MEETING_NOTE } from "../const/api";
import { IRequestGetListMeeting, IRequestGetListMeetingNote } from "../interface/meeting";
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
  getListMeetingNote(body: IRequestGetListMeetingNote) {
    return httpServices.get(`${GET_LIST_MEETING_NOTE}?${queryString.stringify(body)}`);
  }

  createMeetingNote(body: any) {
    return httpServices.post(`${ADD_MEETING_NOTE}`, body);
  }
}

export default new MeetingServices();