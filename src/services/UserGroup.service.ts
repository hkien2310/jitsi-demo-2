import { GET_LIST_PERMISSION, GET_LIST_USER_GROUP, GET_USER_GROUP_DETAIL, PATCH_CHANGE_USER_GROUP, POST_CREATE_USER_GROUP } from "../const/api";
import { IBodyPostCreateUserGroup, IRequestGetListPermission } from "../interface/usergroup";
import httpServices from "./httpServices";

class DocumentServices {
    getListPermission(params: IRequestGetListPermission) {
        return httpServices.get(`${GET_LIST_PERMISSION}`, { params: params });
    };

    postCreateUserGroup(body: IBodyPostCreateUserGroup) {
        return httpServices.post(`${POST_CREATE_USER_GROUP}`, body);
    }

    getListUserGroup(params: IRequestGetListPermission) {
        return httpServices.get(`${GET_LIST_USER_GROUP}`, { params: params });
    };

    getDetailUserGroup(id: number | string) {
        return httpServices.get(`${GET_USER_GROUP_DETAIL(id)}`);
    }

    patchChangeUserGroup(body: IBodyPostCreateUserGroup, id: any) {
        return httpServices.patch(`${PATCH_CHANGE_USER_GROUP(id)}`, body);
    }

    deleteUserGroup(id: number | string) {
        return httpServices.delete(`${GET_USER_GROUP_DETAIL(id)}`);
    }



}

export default new DocumentServices()