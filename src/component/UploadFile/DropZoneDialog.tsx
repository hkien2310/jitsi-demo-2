import React, { useState } from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';

interface IProps {
    open: boolean
    handleClose: () => void
}

const DropzoneDialogExample = (props: IProps) => {
    const { open, handleClose } = props
    const [files, setFiles] = useState<File[]>([]);

    const handleSave = (files: File[]) => {
        // Lưu trữ file và thực hiện hành động nào đó
        setFiles(files);
        // Đóng dialog
        handleClose();
    };

    const handleDelete = (file: File) => {
        // Xử lý xóa file nếu cần
        console.log('Remove file', file);
    };

    return (
        <DropzoneDialog
            open={open}
            onSave={handleSave}
            // acceptedFiles={['*']}
            showPreviews={true}
            maxFileSize={5000000}
            onClose={handleClose}
            onDelete={handleDelete}
        />
    );
};

export default DropzoneDialogExample;