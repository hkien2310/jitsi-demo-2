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
  const { open, handleClose, title, description, icon, children, bgcolor, subTitle, content } = props;

  return (
    <React.Fragment>
      <Dialog maxWidth={false} fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <Box
          sx={{
            paddingLeft: "40px",
            paddingRight: "40px",
            paddingTop: "18px",
            paddingBottom: "18px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "4px 0px 20px 0px rgba(142,142,142,0.1)",
          }}
        >
          {title ? (
            <TypographyCommon
              sx={{
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {title}
            </TypographyCommon>
          ) : (
            <Box></Box>
          )}
          <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => handleClose()}>
            <img src={ImageSource.close} />
          </Button>
        </Box>
        {/* <Box
          sx={{
            height: 40,
            width: 40,
            bgcolor: bgcolor,
            alignItems: "center",
            alignSelf: "center",
            display: "flex",
            justifyContent: "center",
            borderRadius: "50%",
            mt: 4,
          }}
        >
          {icon}
        </Box> */}
        <Box sx={{ backgroundColor: "pink", justifyContent: "center !important ", alignItems: "center !important", display: "flex" }}>
          <img src={ImageSource.warningDelete} style={{ height: "48px", width: "48px" }} />
        </Box>
        {/* <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
          <Box>{subTitle}</Box>
        </DialogTitle> */}
        <Box>{content}</Box>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
