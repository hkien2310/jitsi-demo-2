import { AxiosResponse } from "axios";

export interface IRequestGetListDocument {
    page?: number
    perPage?: number
    sortField?: string
    sortOrder?: string
    textSearch?: string
    status?: string[]
    meetingId?: string
}

export interface IDocumentItem {
    id: any,
    fileName: string,
    fileSize: string,
    filePath: string,
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

export interface IResponseDocument {
    data: IDocumentItem[]
    total: number
}

export type IResponseListDocument = AxiosResponse<IResponseDocument>;

export interface IRequestGetListDocumentNote {
    page?: number
    perPage?: number
    sortField?: string
    sortOrder?: string
    textSearch?: string
    status?: string[]
    meetingDocumentId?: string
}

export interface IDocumentNoteItem {
    id: string,
    content: string,
    creatorId: string,
    meetingDocumentId: string,
    createdAt: string,
    updatedAt: string
}

export interface IResponseDocumentNote {
    data: IDocumentNoteItem[]
    total: number
}

export type IResponseListDocumentNote = AxiosResponse<IResponseDocumentNote>;

export interface IAddDocumentNote {
    meetingDocumentId: string,
    content: string
}