import { GET_COUNT_DASHBOARD, GET_LIST_FILES_DASHBOARD, GET_STATISTICS_DASHBOARD } from "../const/api";
import { IRequestGetListFilesDashboard, IRequestGetStatistics } from "../interface/dashboard";
import httpServices from "./httpServices";

class DashboardService {
    getListDashboardCount() {
        return httpServices.get(`${GET_COUNT_DASHBOARD}`);
    };

    getListDashboardFile(params: IRequestGetListFilesDashboard) {
        return httpServices.get(`${GET_LIST_FILES_DASHBOARD}`, {params: params});
    };

    getStatisticsDashboard(params: IRequestGetStatistics) {
        return httpServices.get(`${GET_STATISTICS_DASHBOARD}`, {params: params});
    } 

}

export default new DashboardService()