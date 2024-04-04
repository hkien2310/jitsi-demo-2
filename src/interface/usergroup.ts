// Request

import { AxiosResponse } from "axios"

//permission
export interface IRequestGetListPermission {
    page?: number
    perPage?: number
    sortField?: string
    sortOrder?: string
    textSearch?: string
}

// post create user group 

export interface IBodyPostCreateUserGroup {
    name: string,
    permissionIds: number[]
}

// get list user group

export interface IRequestGetListUserGroup {
    page?: number
    perPage?: number
    sortField?: string
    sortOrder?: string
    textSearch?: string
}

// Response

//permission
export interface IPermissionItem {
    id: string,
    name: string,
    code: string,
    createdAt: string,
    updatedAt: string
}

export interface IResponsePermission {
    data: IPermissionItem[]
    total: number
}

export type IResponseListPermission = AxiosResponse<IResponsePermission>;

// list user group

export interface IUserGroupItemPermissionItem {
    id: string,
    name: string,
    code: string
}

export interface IUserGroupPermissionList {
    permissionId: string,
    userGroupId: string,
    createdAt: string,
    updatedAt: string,
    permission: IUserGroupItemPermissionItem
}


export interface IUserGroupItem {
    id: string,
    name: string,
    code: string,
    createdAt: string,
    updatedAt: string,
    permissions: IUserGroupPermissionList[]
}

export interface IResponseUserGroup {
    data: IUserGroupItem[]
    total: number
}

export type IResponseListUserGroup = AxiosResponse<IResponseUserGroup>;