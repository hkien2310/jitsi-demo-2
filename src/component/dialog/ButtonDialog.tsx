import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, DialogActions } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  text: React.ReactNode;
  content: React.ReactNode;
  open: boolean;
  onToggle: (open: boolean) => void;
  additionCloseFunction?: () => void;
  dialogTitle: string;
}

export default function ButtonDialog(props: IProps) {
  const { text, content, open, onToggle, additionCloseFunction, dialogTitle } = props;

  const handleClickOpen = () => {
    onToggle(true);
  };

  const handleClose = () => {
    onToggle(false);
    additionCloseFunction && additionCloseFunction();
  };

  return (
    <React.Fragment>
      <Box onClick={handleClickOpen}>{text}</Box>
      <Dialog
        maxWidth={'xl'}
        open={open}
        TransitionComponent={Transition}
        keepMounted={false}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{content}</DialogContentText>
        </DialogContent>
        {/* <DialogActionss>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
}
