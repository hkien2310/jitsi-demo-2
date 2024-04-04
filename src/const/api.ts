const ROOT_URL = `https://demo2-api.hoccontentcunglina.com/api/v1`;
export const ROOT_URL_ASSET = `https://demo2-api.hoccontentcunglina.com`;

export const LOGIN = `${ROOT_URL}/auth/login/`;
export const REFRESH_TOKEN = `${ROOT_URL}/auth/refresh/`;

export const GET_LIST_MEET = `${ROOT_URL}/meeting`
export const CREATE_LIST_MEET = `${ROOT_URL}/meeting`
export const GET_LIST_USER = `${ROOT_URL}/user`

export const POST_UPLOAD_DOCUMENT = `${ROOT_URL}/meeting-document`
export const GET_LIST_DOCUMENT = `${ROOT_URL}/meeting-document`

export const GET_LIST_DOCUMENT_NOTE = `${ROOT_URL}/meeting-document-note`
export const ADD_DOCUMENT_NOTE = `${ROOT_URL}/meeting-document-note`

export const ADD_MEETING_NOTE = `${ROOT_URL}/meeting-note`
export const GET_LIST_MEETING_NOTE = `${ROOT_URL}/meeting-note`
export const DELETE_MEET = `${ROOT_URL}/meeting`

export const GET_COUNT_DASHBOARD = `${ROOT_URL}/dashboard`

export const GET_LIST_FILES_DASHBOARD = `${ROOT_URL}/dashboard/latest-uploaded-files`

export const GET_STATISTICS_DASHBOARD = `${ROOT_URL}/dashboard/statistics`

// user group 

export const GET_LIST_PERMISSION = `${ROOT_URL}/permission`
export const POST_CREATE_USER_GROUP = `${ROOT_URL}/user-group`
export const GET_LIST_USER_GROUP = `${ROOT_URL}/user-group`
export const GET_USER_GROUP_DETAIL = (id: number | string) => `${ROOT_URL}/user-group/${id}`
export const PATCH_CHANGE_USER_GROUP = (id: number | string) => `${ROOT_URL}/user-group/${id}`


