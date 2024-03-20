import React, { useState } from 'react';
import { Dialog, Typography } from '@mui/material';

interface DragDropFileProps {
  open: boolean;
  onClose: () => void;
}

const DragDropFile: React.FC<DragDropFileProps> = ({ open, onClose }) => {
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
    console.log(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Xử lý các file đã được chọn từ file browser ở đây
      console.log(files);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}
      className={`drag-drop-container ${dragging ? 'dragging' : ''}`}
    >
      <div
        className={`drag-drop-container ${dragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ padding: '100px' }}
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
            <Typography variant="body1">
              Drag file here to upload or&nbsp;
              <span className="browse-link">browse for file</span>
            </Typography>
          </label>
        </div>
      </div>
    </Dialog>
  );
};

export default DragDropFile;
