import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Slide } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { IconsSource } from "../../const/icons";
import TypographyCommon from "../Typography";

interface IProps {
    open: boolean
    handleClose: () => void
    title?: string | React.ReactNode
    content: string | React.ReactNode
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogCommon = (props: IProps) => {
    const { open, handleClose, title, content } = props
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted={false}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth={false}
        style={{ width: '100%' }}
    >

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} px={3} py={2}>
            {title ?
                <TypographyCommon sx={{
                    fontSize: '20px',
                    fontWeight: '600'
                }}>{title}</TypographyCommon>
                : <></>}
            <Button onClick={() => handleClose()}>
                <IconsSource.CloseIcon sx={{ fontSize: '30px', fontWeight: '600' }} />
            </Button>
        </Box>
        <Divider />
        <DialogContent>
            {/* <DialogContentText id="alert-dialog-slide-description" > */}
            {content}
            {/* </DialogContentText> */}
        </DialogContent>
    </Dialog>
}

export default DialogCommon