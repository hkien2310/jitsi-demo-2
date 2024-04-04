import { useCallback, useRef, useState } from "react";
import { IRequestGetStatistics, IResponseStatisticsItem } from "../interface/dashboard";
import DashboardServices from "../services/Dashboard.services";

const useGetListDashboardDataChart = () => {
    const [data, setData] = useState<IResponseStatisticsItem[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const trigger = useRef<any>(null)


    const fetch = useCallback((params: IRequestGetStatistics) => {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    setLoading(true)
                    trigger.current = true
                    const response = await DashboardServices.getStatisticsDashboard(params);
                    const data = response.data as IResponseStatisticsItem[]
                    setData(data)
                    resolve(response);
                } catch (error) {
                    setError(error);
                    reject(error);
                } finally {
                    setLoading(false)
                    trigger.current = false
                }
            })();
        });
    }, []);

    return {
        data,
        isLoading,
        error,
        fetch
    }
}

export default useGetListDashboardDataChart