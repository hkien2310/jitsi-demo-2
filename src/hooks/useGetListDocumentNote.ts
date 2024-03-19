import { useEffect, useState, useCallback } from "react";
import cloneDeep from "lodash/cloneDeep";
import { isEmpty } from "lodash";

import { useSave } from "../store/useStores";
import { showError } from "../helper/toast";
import { IRequestGetListDocument, IRequestGetListDocumentNote, IResponseDocument, IResponseDocumentNote, IResponseListDocument, IResponseListDocumentNote } from "../interface/document";
import DocumentServices from "../services/Document.services";

//* Check parse body request
const parseRequest = (filters?: IRequestGetListDocumentNote) => {
    return cloneDeep({
        page: (filters?.page || 0) + 1,
        page_size: filters?.perPage,
        sortField: 'createdAt',
        sortOrder: 'asc',
        textSearch: filters?.textSearch,
        status: filters?.status,
        meetingDocumentId: filters?.meetingDocumentId
    });
};

const useGetListDocumentNote = (
    filters?: IRequestGetListDocumentNote,
    options: { isTrigger?: boolean; refetchKey?: string } = { isTrigger: true, refetchKey: "" }
) => {
    //! State
    const { isTrigger = true, refetchKey = "" } = options;
    console.log(filters, 'filtersfilters')
    const save = useSave();
    const [data, setData] = useState<IResponseDocumentNote>();
    const [isLoading, setLoading] = useState(false);
    const [isRefetching, setRefetching] = useState(false);
    const [isFetchingPage, setFetchingPage] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [hasMore, setHasMore] = useState(false);
    //   save('LIST_DATA_CUSTOMER', data)

    //! Function
    const fetch: () => Promise<IResponseListDocumentNote> | undefined = useCallback(() => {
        if (!isTrigger) {
            return;
        }

        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const nextFilters = parseRequest(filters);
                    const response = await DocumentServices.getListDocumentNote(nextFilters);
                    resolve(response);
                } catch (error) {
                    setError(error);
                    reject(error);
                    setFetchingPage(false);
                }
            })();
        });
    }, [filters, isTrigger]);

    const checkConditionPass = useCallback((response: IResponseListDocumentNote) => {
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
    const refetch = useCallback(async (filters: IRequestGetListDocumentNote) => {
        console.log(filters, 'filtersfiltersfilters')
        try {
            setRefetching(true);
            const nextFilters = parseRequest(filters);
            const response = await DocumentServices.getListDocumentNote(nextFilters);
            checkConditionPass(response);
            setRefetching(false);
        } catch (error: any) {
            if (!error.isCanceled) {
                showError(error);
            }
        }
    }, [checkConditionPass]);

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

export default useGetListDocumentNote;
