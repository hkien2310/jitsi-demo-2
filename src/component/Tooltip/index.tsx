import { IconButton, Tooltip, ButtonProps } from "@mui/material";
interface Props extends ButtonProps {
  title: string;
}

const TooltipButton = (props: Props) => {
  const { title, ...remainProps } = props;
  return (
    <Tooltip title={title} arrow>
      <IconButton {...remainProps} aria-label={title}>
        {props.children}
      </IconButton>
    </Tooltip>
  );
};
export default TooltipButton;
