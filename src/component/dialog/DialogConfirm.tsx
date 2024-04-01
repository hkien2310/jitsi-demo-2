import { Box, Button, Slide } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import TypographyCommon from "../Typography";
import { ImageSource } from "../../assets/Image";
interface IProps {
  open: boolean;
  handleClose: () => void;
  title?: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children?: string | React.ReactNode;
  footer?: React.ReactNode;
  icon?: any;
  bgcolor?: any;
  content?: React.ReactNode;
  isDelete?: boolean
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function DialogConfirm(props: IProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { open, handleClose, title, description, icon, children, bgcolor, subTitle, content, isDelete } = props;

  return (
    <React.Fragment>
      <Dialog maxWidth={"lg"} fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <Button sx={{ padding: 0, minWidth: 0, position: 'absolute', right: '10px', top: '10px' }} onClick={() => handleClose()}>
          <img src={ImageSource.close} />
        </Button>
        <Box sx={{ justifyContent: "center !important ", alignItems: "center !important", display: "flex", pt: '36px' }}>
          <img src={ isDelete ? ImageSource.warningDelete : ImageSource.warning } style={{ height: "48px", width: "48px" }} />
        </Box>
        <Box>{content}</Box>
        <DialogContent sx={{ padding: 0 }}>{children}</DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
