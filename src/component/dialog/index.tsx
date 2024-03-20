import { Dialog, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

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
    >
        {title ?
            <DialogTitle>{title}</DialogTitle>
            : <></>}
        <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" >
                {content}
            </DialogContentText>
        </DialogContent>
    </Dialog>
}

export default DialogCommon