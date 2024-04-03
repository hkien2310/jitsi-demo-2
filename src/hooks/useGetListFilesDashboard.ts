import { useEffect, useState, useCallback, useRef } from "react";
import cloneDeep from "lodash/cloneDeep";
import { isEmpty } from "lodash";

import { useSave } from "../store/useStores";
import { showError } from "../helper/toast";
import { IRequestGetListFilesDashboard, IResponseFilesDashboard, IResponseListFilesDashboard } from "../interface/dashboard";
import DashboardServices from "../services/Dashboard.services";

//* Check parse body request
const parseRequest = (filters?: IRequestGetListFilesDashboard) => {
    return cloneDeep({
        page: (filters?.page || 0),
        perPage: filters?.perPage,
        sortField: 'createdAt',
        sortOrder: 'asc',
        textSearch: filters?.textSearch,
    });
};

const useGetListFilesDashboard = (
    filters?: IRequestGetListFilesDashboard,
    isConcat?: boolean,
    options: { isTrigger?: boolean; refetchKey?: string } = { isTrigger: true, refetchKey: "" }
) => {
    //! State
    const { isTrigger = true, refetchKey = "" } = options;
    const stateOnload = useRef<boolean>(false)

    const save = useSave();
    const [data, setData] = useState<IResponseFilesDashboard>();
    const [isLoading, setLoading] = useState(false);
    const [isRefetching, setRefetching] = useState(false);
    const [isFetchingPage, setFetchingPage] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [hasMore, setHasMore] = useState(true);
    //   save('LIST_DATA_CUSTOMER', data)

    //! Function
    const fetch: () => Promise<IResponseListFilesDashboard> | undefined = useCallback(() => {
        stateOnload.current = true
        if (!isTrigger) {
            return;
        }

        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const nextFilters = parseRequest(filters);
                    const response = await DashboardServices.getListDashboardFile(nextFilters);
                    resolve(response);
                } catch (error) {
                    setError(error);
                    reject(error);
                    setFetchingPage(false);
                } finally {
                    stateOnload.current = false
                }
            })();
        });
    }, [filters, isTrigger]);

    const checkConditionPass = useCallback((response: IResponseListFilesDashboard) => {
        //* Check condition of response here to set data
        if (!isEmpty(response?.data)) {
            if(isConcat) {
                setData((prev) => {
                    return {
                        total: response.data?.total,
                        data: [...(prev?.data || []), ...(response.data?.data || [])]
                    }
                })
            } else {
                setData(response.data)
            }
            if(response?.data?.data) {
                console.log('á đù má', response?.data?.data?.length, filters?.perPage)
                setHasMore(response?.data?.data?.length === (filters?.perPage || 10) )
            }
        }
    }, [filters?.perPage, isConcat]);

    const fetchChangePage = useCallback(
        async (shouldSetData: boolean) => {
            setFetchingPage(true);
            const response = await fetch();
            if (shouldSetData && response) {
                checkConditionPass(response);
            }

            setFetchingPage(false);
        },
        [fetch, checkConditionPass]
    );

    //* Refetch implicity (without changing loading state)
    const refetch = useCallback(async () => {
        try {
            setRefetching(true);
            const nextFilters = parseRequest(filters);
            const response = await DashboardServices.getListDashboardFile(nextFilters);
            checkConditionPass(response);
            setRefetching(false);
        } catch (error: any) {
            if (!error.isCanceled) {
                showError(error);
            }
        }
    }, [checkConditionPass, filters]);

    useEffect(() => {
        save(refetchKey, refetch);
    }, [save, refetchKey, refetch]);

    //* Refetch with changing loading state
    const refetchWithLoading = useCallback(
        async (shouldSetData: boolean) => {
            try {
                setLoading(true);
                const response = await fetch();
                if (shouldSetData && response) {
                    checkConditionPass(response);
                }
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        },
        [fetch, checkConditionPass]
    );

    useEffect(() => {
        if(!stateOnload.current) {
            let shouldSetData = true;
            if (filters?.page !== undefined && filters?.page <= 0) {
                refetchWithLoading(shouldSetData);
                return;
            }
    
            //* If offset > 0 -> fetch more
            fetchChangePage(shouldSetData);
    
            return () => {
                shouldSetData = false;
            };
        }
    }, [filters?.page, fetchChangePage, refetchWithLoading]);

    return {
        data,
        isLoading,
        error,
        refetch,
        refetchWithLoading,
        isRefetching,
        isFetchingPage,
        hasMore,
        setData,
    };
};

export default useGetListFilesDashboard;
