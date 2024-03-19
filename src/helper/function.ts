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
  