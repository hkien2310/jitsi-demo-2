import { Box, Button, Dialog, DialogActions, DialogContent, Slide, SxProps, Theme } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useMemo } from "react";
import { ImageSource } from "../../assets/Image";
import TypographyCommon from "../Typography";
import cacheKeys from "../../const/cachedKeys";
import { useGet } from "../../store/useStores";
import { DeviceType } from "../../hooks/useDivices";

interface IProps {
  open: boolean;
  handleClose: () => void;
  title?: string | React.ReactNode;
  content: string | React.ReactNode;
  footer?: React.ReactNode;
  sx?: SxProps<Theme> | undefined
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
  const { open, handleClose, title, content, footer, sx } = props;
  const deviceType = useGet(cacheKeys.DEVICE_TYPE)
  const isMobile = useMemo(() => {
    return deviceType === DeviceType.MOBILE
  }, [deviceType])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted={false}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      maxWidth={false}
      style={{ width: "100%", borderRadius: 0 }}
    >
      <Box sx={{ borderRadius: `{8px} !important` }}>
        <Box

          sx={{
            paddingLeft: isMobile ? '20px': "40px",
            paddingRight: isMobile ? '20px': "40px",
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
            <img src={ImageSource.close} alt={''} />
          </Button>
        </Box>
        <DialogContent sx={{
          paddingLeft: isMobile ? '20px': '40px',
          paddingRight: isMobile ? '20px': '40px',
          paddingTop: '36px',
          paddingBottom: '36px',
          ...sx
        }}>
          {content}
        </DialogContent>
        <DialogActions>{footer && footer}</DialogActions>
      </Box>
    </Dialog>
  );
};

export default DialogCommon;
