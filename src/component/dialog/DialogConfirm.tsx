import { Box, Slide } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
interface IProps {
  open: boolean;
  handleClose: () => void;
  title: string | React.ReactNode;
  children?: string | React.ReactNode;
  footer?: React.ReactNode;
  icon?: any;
  bgcolor?: any
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
  const { open, handleClose, title, icon, children, bgcolor } = props;

  return (
    <React.Fragment>
    
      <Dialog
        maxWidth={false}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <Box
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
        </Box>
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
          <Box>{title}</Box>
        </DialogTitle>
        <DialogContent >
            {children}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
