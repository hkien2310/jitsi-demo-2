import { AxiosResponse } from "axios";

export interface IRequestGetListMeeting {
    page?: number
    perPage?: number
    sortField?: string
    sortOrder?: string
    textSearch?: string
    status?: string[]
}

export interface IMeetingItem {
    createdAt?: string
    creatorId?: number
    id?: number
    isRequirePassword?: boolean
    meetingCode?: string
    meetingPassword?: string
    startedAt?: any
    status?: string
    title?: string
    updatedAt?: string
}

export interface IResponseMeeting {
    data: IMeetingItem[]
    total: number
}

export type IResponseListMeeting = AxiosResponse<IResponseMeeting>;


// meeting note

export interface IRequestGetListMeetingNote {
    page?: number
    perPage?: number
    sortField?: string
    sortOrder?: string
    textSearch?: string
    meetingId?: any
}

export interface IMeetingNoteItem {
    id: string,
    content: string,
    creatorId: string,
    meetingId: string,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        username: string,
        fullname: string,
        email: string
    }
}

export interface IResponseMeetingNote {
    data: IMeetingNoteItem[]
    total: number
}

export type IResponseListMeetingNote = AxiosResponse<IResponseMeetingNote>;
