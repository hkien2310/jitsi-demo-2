import queryString from "query-string";
import { ADD_MEETING_NOTE, CREATE_LIST_MEET, DELETE_MEET, GET_LIST_MEET, GET_LIST_MEETING_NOTE } from "../const/api";
import { IRequestGetListMeeting, IRequestGetListMeetingNote } from "../interface/meeting";
import httpServices from "./httpServices";

class MeetingServices {
  getListMeeting(body: IRequestGetListMeeting) {
    return httpServices.get(`${GET_LIST_MEET}`, {params: body});
    // return httpServices.get(`${GET_LIST_MEET}`);
  };
  createMeeting(body: any) {
    return httpServices.post(`${CREATE_LIST_MEET}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
    }
    });
  };
  getListMeetingNote(body: IRequestGetListMeetingNote) {
    return httpServices.get(`${GET_LIST_MEETING_NOTE}?${queryString.stringify(body)}`);
  }
  deleteMeeting(id: number) {
    return httpServices.delete(`${DELETE_MEET}/${id}`)
  }
  updateMeeting(id: number, body: any) {
    return httpServices.patch(`${CREATE_LIST_MEET}/${id}`, body)
  }

  createMeetingNote(body: any) {
    return httpServices.post(`${ADD_MEETING_NOTE}`, body);
  }
}

export default new MeetingServices();