import { Box, Button } from '@mui/material'
import TypographyCommon from '../Typography'
import DragAndDrop, { renderLogo } from './Drag'
import { useState } from 'react'
import { colors } from '../../const/colors';

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
            setFiles((prev) => {
                if(prev) {
                    return [...(prev), ...listFile]
                }
                return listFile
            })
            onFileSelected(listFile)
        }
    }
    return <Box sx={{ backgroundColor: 'white' }}>
        {/* <Box pb={1} sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
        </Box> */}

        <Box pt={1} >
            {/* <TypographyCommon >
                Sau khi tải lên, tài liệu sẽ được thêm vào cuộc họp
            </TypographyCommon> */}

            <Box py={1}>
                <DragAndDrop onFileSelected={fileChange} />
            </Box>
            <Box p={2} sx={{ border: `2px solid ${colors.border.main}`, borderRadius: '5px' }}>
                <TypographyCommon sx={{ fontWeight: 600, display: 'flex' }}>
                    Danh sách tài liệu đã tải lên <TypographyCommon ml={1} style={{color: colors.text.primary, fontWeight: 600}}>{`(${files?.length || 0})`}</TypographyCommon>
                </TypographyCommon>
                {files?.map((e) => {
                    return <Box mt={1} p={1} key={e?.lastModified} sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.border.main}`, borderRadius: '5px' }}>
                        <Box sx={{display: 'flex', alignItems: 'center', }}>
                            <img src={renderLogo(e?.name?.split('.')?.pop() || '')} alt={'logo'} style={{ width: '50px', height: '50px' }} />
                            <TypographyCommon pl={1} style={{ color: colors.text.primary, fontWeight: 600 }}>
                                {e?.name}
                            </TypographyCommon>
                        </Box>
                    </Box>
                })}
                {/* {(!files) || files?.length === 0 ?
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', border: `1px solid ${colors.border.main}`, borderRadius: '5px' }} p={2}>
                        <Box alignSelf={'center'}>
                            <IconsSource.FolderOffIcon sx={{fontSize: 30}}/>
                        </Box>
                        <Box>
                            <TypographyCommon textAlign={'center'}>
                                Chưa có tài liệu được tải lên
                            </TypographyCommon>
                        </Box>
                    </Box> : <></>} */}
            </Box>
        </Box>
    </Box>

}

export default UploadFile