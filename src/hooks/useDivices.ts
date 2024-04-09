import { useState, useEffect } from 'react';
import useStore, { useGet, useSave } from '../store/useStores';
import cacheKeys from '../const/cachedKeys';

export enum DeviceType {
    MOBILE = 'mobile',
    TABLET = 'tablet',
    PC = 'pc'
}

function useDeviceType() {
    const save = useSave();
    const deviceType = useGet(cacheKeys.DEVICE_TYPE)

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            const device = width < 768 ?
                DeviceType.MOBILE
                :
                width <= 1024
                    ?
                    DeviceType.TABLET
                    :
                    DeviceType.PC
                ;
            if (deviceType !== device) {
                save(cacheKeys.DEVICE_TYPE, device)
            }
        }

        // Thêm sự kiện lắng nghe khi kích thước cửa sổ thay đổi
        window.addEventListener('resize', handleResize);

        // Gọi handleResize khi component được mount để xác định trạng thái ban đầu
        handleResize();

        // Loại bỏ sự kiện lắng nghe khi component bị unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [save]); // Chỉ gọi useEffect một lần khi component được mount

    return deviceType;
}

export default useDeviceType;
