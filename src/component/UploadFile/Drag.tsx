import { Box } from '@mui/material';
import React, { useState } from 'react';
import TypographyCommon from '../Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface IProps {
    onFileSelected?: (files: File[] | null) => void
}

const DragAndDrop = (props: IProps) => {
    const { onFileSelected } = props
    const [dragging, setDragging] = useState<boolean>(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);

        const files = Array.from(e.dataTransfer.files);
        // Xử lý các file đã được thả vào ở đây
        onFileSelected?.(files)
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // Xử lý các file đã được chọn từ file browser ở đây
            const newFile = Array.from(files)
            onFileSelected?.(newFile)
        }
    };

    return (
        <div
            className={`drag-drop-container ${dragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                border: '1px dashed',
                borderRadius: '5px',
                paddingTop: '10px',
                paddingBottom: '10px',
            }}
        >
            <div className="drag-drop-content">
                <input
                    type="file"
                    id="file-input"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                />
                <label htmlFor="file-input">
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <CloudUploadIcon style={{ width: '50px', height: '50px', alignSelf: 'center', marginBottom: '10px' }}/>
                        <TypographyCommon sx={{ textAlign: 'center' }}>
                            {/* Kéo và thả file hoặc&nbsp; */}
                            <span className="browse-link">Chọn tài liệu</span>
                        </TypographyCommon>
                    </Box>
                </label>
            </div>
        </div>
    );
};

export default DragAndDrop;
