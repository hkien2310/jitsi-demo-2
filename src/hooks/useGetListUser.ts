import { useEffect, useState, useCallback } from "react";
import cloneDeep from "lodash/cloneDeep";
import { isEmpty } from "lodash";

import { useSave } from "../store/useStores";
import { showError } from "../helper/toast";
import { IRequestGetListUser, IResponseListUser, IResponseUser } from "../interface/user";
import UserServices from "../services/User.services";
import { IRequestGetListMeeting } from "../interface/meeting";

//* Check parse body request
const parseRequest = (filters?: IRequestGetListUser) => {
    return cloneDeep({
        page: (filters?.page || 0) + 1,
        page_size: filters?.perPage,
        sortField: 'createdAt',
        sortOrder: 'asc',
        textSearch: filters?.textSearch,
        status: filters?.status,
    });
};

const useGetListUser = (
    filters?: IRequestGetListUser,
    options: { isTrigger?: boolean; refetchKey?: string } = { isTrigger: true, refetchKey: "" }
) => {
    //! State
    const { isTrigger = true, refetchKey = "" } = options;

    const save = useSave();
    const [data, setData] = useState<IResponseUser>();
    const [isLoading, setLoading] = useState(false);
    const [isRefetching, setRefetching] = useState(false);
    const [isFetchingPage, setFetchingPage] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [hasMore, setHasMore] = useState(false);
    //   save('LIST_DATA_CUSTOMER', data)

    //! Function
    const fetch: () => Promise<IResponseListUser> | undefined = useCallback(() => {
        if (!isTrigger) {
            return;
        }

        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const nextFilters = parseRequest(filters);
                    const response = await UserServices.getListUser(nextFilters);
                    resolve(response);
                } catch (error) {
                    setError(error);
                    reject(error);
                    setFetchingPage(false);
                }
            })();
        });
    }, [filters, isTrigger]);

    const checkConditionPass = useCallback((response: IResponseListUser) => {
        //* Check condition of response here to set data
        if (!isEmpty(response?.data)) {
            setData(response.data);
            setHasMore(!isEmpty(response?.data));
        }
    }, []);

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
    const refetch = useCallback(async (filter?: IRequestGetListMeeting) => {
        try {
            setRefetching(true);
            const nextFilters = parseRequest(filter ? filter : filters );
            const response = await UserServices.getListUser(nextFilters);
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

export default useGetListUser;
