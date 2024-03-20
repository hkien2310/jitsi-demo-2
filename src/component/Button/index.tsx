import Button, { ButtonProps } from "@mui/material/Button";

interface Props extends ButtonProps {}

const ButtonCommon = (props: Props) => {
  const { ...remainProps } = props;
  return (
    <Button
      sx={{
        borderRadius: 3,
      }}
      {...remainProps}
    >
      {props.children}
    </Button>
  );
};

export default ButtonCommon;
