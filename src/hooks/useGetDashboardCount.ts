import { useCallback, useEffect, useRef, useState } from "react";
import DashboardServices from "../services/Dashboard.services";
import { IResponseDashboardCount } from "../interface/dashboard";

const useGetListDashboardCount = () => {
    const [data, setData] = useState<IResponseDashboardCount>();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const trigger = useRef<any>(null)


    const fetch = useCallback(() => {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    setLoading(true)
                    trigger.current = true
                    const response = await DashboardServices.getListDashboardCount();
                    const data = response.data as IResponseDashboardCount
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

    useEffect(() => {
        if(!trigger.current) {
            fetch()
        }
    }, [fetch])

    return {
        data, 
        isLoading,
        error
    }
}

export default useGetListDashboardCount