import { AxiosResponse } from "axios";

export interface IRequestGetListUser {
    page?: number
    perPage?: number
    sortField?: string
    sortOrder?: string
    textSearch?: string
    status?: string[]
}
export interface IGetDetailUser {
    id: number
}

export interface IUserItem {
    id: string,
    username: string,
    password: string,
    fullname: string,
    role: string,
    email: string,
    createdAt: string,
    updatedAt: string
}

export interface IResponseUser {
    data: IUserItem[]
    total: number
}

export type IResponseListUser = AxiosResponse<IResponseUser>;
export interface IUser {
    account: string,
    password: string,
    fullName: string,
    email: string
}
