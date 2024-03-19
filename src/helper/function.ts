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
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file.');
        onFailed?.()
    }
};
