import { useCallback, useEffect, useState } from 'react';
import UserServices from '../services/User.services';

export const useGetDetailUser = (id: number) => {
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>('');

    const callApi = useCallback(() => {
        return UserServices.getDetailUser(id)
    }, [id]);

    const transformResponse = useCallback((response: any) => {
        if (response) {
            setData(response?.data);
        }
    }, []);

    const refetch = useCallback(async () => {
        try {
            const response = await callApi();
            transformResponse(response);
        } catch (error) {
            setError(error);
        }
    }, []);

    useEffect(() => {
        let shouldSetData = true;

        (async () => {
            try {
                setLoading(true);
                const response = await callApi();
                if (shouldSetData) {
                    transformResponse(response);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            shouldSetData = false;
        };
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch,
    };
};
