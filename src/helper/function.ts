import axios from 'axios';
import { POST_UPLOAD_DOCUMENT } from '../const/api';

export function searchParamsToObject(search: string): Record<string, string> {
    const params = new URLSearchParams(search);
    const obj: Record<string, string> = {};
    params.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}

export interface IUploadFile {
    file: File | null,
    meetingId: any,
    onSuccess?: () => void
    onFailed?: () => void
}

export const uploadFile = async (props: IUploadFile) => {

    const { file, meetingId, onSuccess, onFailed } = props
    if (!file) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('meetingId', meetingId);

    try {
        const response = await axios.post(POST_UPLOAD_DOCUMENT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        onSuccess?.()
    } catch (error: any) {
        console.log('Failed to upload file:', error?.response?.data?.message);
        alert(`Failed to upload file ${error?.response?.data?.message || ''}`);
        onFailed?.()
    }
};


export const downloadFile = (url: string, filename: string) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        })
        .catch(error => {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        });
};


export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const renderSTT = (index: number, page: number, pagesize: number) => {
    if (page === 0) {
        return index + 1
    } else {
        return (Number(page)) * Number(pagesize) + (Number(index) + 1)
    }
}

export function calculateTotalPages(total: number, perPage: number) {
    if (total <= 0) {
        return 0;
    } else {
        return Math.ceil(total / perPage);
    }
}

export function generateMessage(data: any[], page: number, pageSize: number, total: number) {
    const startIndex = (page - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, total);
    console.log(startIndex, endIndex, 'endIndexendIndex')

    return `Hiển thị từ ${startIndex} đến ${endIndex} trong tổng số ${total} bản ghi`;
}