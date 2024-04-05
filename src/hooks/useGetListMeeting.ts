import { useEffect, useState, useCallback, useRef } from "react";
import cloneDeep from "lodash/cloneDeep";
import { isEmpty } from "lodash";

import { IRequestGetListMeeting, IResponseListMeeting, IResponseMeeting } from "../interface/meeting";
import { useSave } from "../store/useStores";
import MeetingServices from "../services/Meeting.services";
import { showError } from "../helper/toast";

//* Check parse body request
const parseRequest = (filters?: IRequestGetListMeeting) => {
    console.log(filters, 'filters')
    return cloneDeep({
        page: (filters?.page || 0) + 1,
        page_size: filters?.perPage,
        sortField: 'createdAt',
        sortOrder: 'asc',
        textSearch: filters?.textSearch,
        status: filters?.status,
    });
};

const useGetListMeeting = (
    filters?: IRequestGetListMeeting,
    options: { isTrigger?: boolean; refetchKey?: string } = { isTrigger: true, refetchKey: "" }
) => {
    //! State
    const { isTrigger = true, refetchKey = "" } = options;
    const trigger = useRef(false)

    const save = useSave();
    const [data, setData] = useState<IResponseMeeting>();
    const [isLoading, setLoading] = useState(true);
    const [isRefetching, setRefetching] = useState(false);
    const [isFetchingPage, setFetchingPage] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [hasMore, setHasMore] = useState(false);
    //   save('LIST_DATA_CUSTOMER', data)

    //! Function
    const fetch: () => Promise<IResponseListMeeting> | undefined = useCallback(() => {
        trigger.current = true
        if (!isTrigger) {
            return;
        }
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const nextFilters = parseRequest(filters);
                    const response = await MeetingServices.getListMeeting(nextFilters);
                    resolve(response);
                } catch (error) {
                    setError(error);
                    reject(error);
                    setFetchingPage(false);
                } finally {
                    trigger.current = false
                }
            })();
        });
    }, [filters, isTrigger]);

    const checkConditionPass = useCallback((response: IResponseListMeeting) => {
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
            const nextFilters = parseRequest(filter ? filter : filters);
            const response = await MeetingServices.getListMeeting(nextFilters);
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
            } catch (error) {
            } finally {
                setLoading(false);
            }
        },
        [fetch, checkConditionPass]
    );

    useEffect(() => {
        if (!trigger.current) {
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

export default useGetListMeeting;
