import React from "react";
import { InputAdornment, SxProps } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import MuiTextField, { TextFieldProps, TextFieldPropsSizeOverrides } from "@mui/material/TextField";
import { FieldInputProps, FormikProps, getIn } from "formik";
import { ReactNode, useMemo } from "react";
// import { NumericFormat, NumericFormatProps } from "react-number-format";

// interface CustomProps {
//   onChange: (event: { target: { name: string; value: string } }) => void;
//   name: string;
//   prefix?: string;
// }

// const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(function NumericFormatCustom(props, ref) {
//   const { onChange, prefix, ...other } = props;

//   return (
//     <NumericFormat
//       {...other}
//       getInputRef={ref}
//       onValueChange={(values) => {
//         onChange({
//           target: {
//             name: props.name,
//             value: values.value,
//           },
//         });
//       }}
//       thousandSeparator=","
//       decimalSeparator="."
//       valueIsNumericString
//       prefix={prefix}
//     />
//   );
// });

interface Props {
  field?: FieldInputProps<any>;
  form?: FormikProps<any>;
  variant?: TextFieldVariants;
  size: "small" | "medium";
  iconStartInput?: ReactNode;
  sx?: SxProps;
  iconEndInput?: ReactNode;
  onChangeCustomize?: (value: any) => void;
  afterOnChange?: (value: string) => void;
  onClickEndAdornment?: () => void;
  sxEndAdornment?: SxProps;
  type?: string;
  prefix?: string;
  isFormatNumber?: boolean;
  disabled?: boolean;
}

const TextField = ({
  field,
  form,
  variant,
  size,
  iconStartInput,
  sx,
  iconEndInput,
  onChangeCustomize,
  afterOnChange,
  onClickEndAdornment,
  sxEndAdornment,
  type = "text",
  isFormatNumber,
  disabled = false,
  ...props
}: Props & TextFieldProps) => {
  const { name, value, onBlur, onChange } = field || {};
  const { errors, touched } = form || {};
  const isTouched = getIn(touched, name!);
  const errorMessage = getIn(errors, name!);
  // const { show: showPassword, toggle: togglePassword } = useToggleDialog();
  const [showPassword, setShowPassword] = React.useState(false)

  const typePassword = useMemo(() => {
    return showPassword ? "text" : "password";
  }, [showPassword]);

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <MuiTextField
      type={type === "password" ? typePassword : type}
      name={name}
      value={value}
      onBlur={onBlur}
      onChange={(e) => {
        if (onChangeCustomize) {
          onChangeCustomize(e.target.value);
          return;
        }

        onChange && onChange(e);
        afterOnChange && afterOnChange(e.target.value);
      }}
      error={isTouched && Boolean(errorMessage)}
      helperText={isTouched && errorMessage}
      variant={variant}
      size={size}
      sx={{
        [`input[type='password']::-ms-reveal,input[type='password']::-ms-clear`]: {
          display: "none",
        },
        "& div": {
          borderRadius: "0.5rem",
        },
        "& label": {
          "& .MuiFormLabel-asterisk": {
            color: 'red'
          }
        },
        "& input": {},
        ...sx,
      }}
      InputProps={{
        // inputComponent: isFormatNumber ? (NumericFormatCustom as any) : undefined,
        startAdornment: iconStartInput ? (
          <InputAdornment position="start" className="icon-start-input">
            {iconStartInput}
          </InputAdornment>
        ) : undefined,
        endAdornment: iconEndInput ? (
          <InputAdornment position="end" sx={sxEndAdornment || {}} onClick={onClickEndAdornment || undefined}>
            {iconEndInput}
          </InputAdornment>
        ) : type === "password" ? (
          <InputAdornment position="end">
            <IconButton onClick={setShowPassword((prev) => !prev)} onMouseDown={handleMouseDown} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      disabled={disabled}
      {...props}
    />
  );
};

export default TextField;
