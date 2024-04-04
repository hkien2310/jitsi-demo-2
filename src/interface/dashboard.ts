import { AxiosResponse } from "axios"

export interface IResponseDashboardCount {
  IN_MEETING: number,
  FINISHED: number
}

export interface IRequestGetListFilesDashboard {
    page?: number
    perPage?: number
    sortField?: string
    sortOrder?: string
    textSearch?: string
}

export interface IFilesDashboard {
    id: any,
    fileName: string,
    fileSize: string,
    filePath: string,
    creatorId: string,
    meetingId: string,
    createdAt: string,
    updatedAt: string,
}

export interface IResponseFilesDashboard {
    data: IFilesDashboard[]
    total: number
}

export type IResponseListFilesDashboard = AxiosResponse<IResponseFilesDashboard>;

export interface IRequestGetStatistics {
    fromDate: string
    toDate: string
}

export interface IResponseStatisticsItem {
    date: string
    meetingCount: number
}

export type IResponseStatisticsList = AxiosResponse<IResponseStatisticsItem[]>;