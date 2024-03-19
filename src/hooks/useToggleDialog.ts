import { TIMEOUT_TO_UNMOUNT_MODAL } from "constants/enum";
import { useCallback, useState } from "react";

const useToggleDialog = () => {
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
    setTimeout(() => {
      setClose((prev) => !prev);
    }, TIMEOUT_TO_UNMOUNT_MODAL);
  }, []);

  const shouldRender = open || close;

  return { open, toggle, shouldRender };
};

export default useToggleDialog;
