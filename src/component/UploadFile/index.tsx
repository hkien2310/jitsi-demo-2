import { Box, Button } from '@mui/material'
import TypographyCommon from '../Typography'
import DragAndDrop from './Drag'
import { useState } from 'react'
import AttachmentIcon from '@mui/icons-material/Attachment';

interface IProps {
    onFileSelected: (files: File[] | null) => void
    handleClose: () => void
}

const UploadFile = (props: IProps) => {
    const { onFileSelected, handleClose } = props

    const [files, setFiles] = useState<File[] | null>(null)

    const fileChange = (e: File[] | null) => {
        if (e) {
            const listFile = Array.from(e)
            setFiles(listFile)
        }
    }
    return <>
        <Box pb={1} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid grey' }}>
            <TypographyCommon
                sx={{
                    fontSize: '20px',
                    fontWeight: '600'
                }}
            >
                Tải lên tài liệu
            </TypographyCommon>
            <Box>
                <Button onClick={() => handleClose()}>Đóng</Button>
                <Button variant='contained' onClick={() => {
                    onFileSelected(files)
                    handleClose()
                }}>Xác nhận</Button>
            </Box>
        </Box>

        <Box pt={1} >
            <TypographyCommon >
                Sau khi tải lên, tài liệu sẽ được thêm vào cuộc họp
            </TypographyCommon>

            <Box py={1}>
                <DragAndDrop onFileSelected={fileChange} />
            </Box>
            <Box py={1}>
                <TypographyCommon sx={{ textTransform: 'uppercase' }}>
                    Danh sách tài liệu:
                </TypographyCommon>
                {files?.map((e) => {
                    return <Box key={e?.lastModified} sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachmentIcon />
                        <TypographyCommon pl={1}>
                            {e?.name}
                        </TypographyCommon>
                    </Box>
                })}
            </Box>
        </Box>
    </>

}

export default UploadFile