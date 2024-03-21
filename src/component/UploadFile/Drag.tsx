import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import TypographyCommon from '../Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { colors } from '../../const/colors';
import { ImageSource } from '../../assets/Image';

interface IProps {
    onFileSelected?: (files: File[] | null) => void
}

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
const wordExtensions = ['doc', 'docx', 'rtf'];
const fileExtensions = ['pdf', 'doc', 'docx', 'rtf'];
const excelExtensions = ['xlsx', 'xls', 'csv', 'ods', 'xlsm', 'xlsb'];


export const renderLogo = (type: string) => {
    if (imageExtensions?.includes(type)) {
        return ImageSource.imgLogo
    } else if (wordExtensions?.includes(type)) {
        return ImageSource.wordLogo
    } else if (fileExtensions?.includes(type)) {
        return ImageSource.pdfLogo
    } else if (excelExtensions?.includes(type)) {
        return ImageSource.xslLogo
    } else {
        return ImageSource.otherLogo
    }
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
                border: `dashed`,
                borderColor: colors.border.main,
                backgroundColor: colors.background.dropzone,
                borderRadius: '5px',
                strokeDasharray: 100

            }}
        >
            <Button className="drag-drop-content" fullWidth>
                <input
                    type="file"
                    id="file-input"
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                />
                <label htmlFor="file-input">
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <CloudUploadIcon style={{ width: '50px', height: '50px', alignSelf: 'center', color: colors.text.primary }} />
                        <TypographyCommon sx={{ textAlign: 'center' }}>
                            {/* Kéo và thả file hoặc&nbsp; */}
                            <span className="browse-link" style={{fontWeight: 600, textTransform: 'none'}}>Chọn tài liệu</span>
                        </TypographyCommon>
                    </Box>
                </label>
            </Button>
        </div>
    );
};

export default DragAndDrop;
