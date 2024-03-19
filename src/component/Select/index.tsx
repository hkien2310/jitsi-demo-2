import { useTheme } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { BaseSelectProps, SelectChangeEvent } from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import { FieldInputProps, FormikProps } from "formik";
import { get, isArray } from "lodash";

const useStyles = makeStyles(() => {
  return {
    listSubMenu: {
      display: "flex !important",
      justifyContent: "space-between !important",
      position: "relative",
    },
  };
});
interface SelectOption {
  label: string | number;
  value: string | number | undefined;
  disabled?: boolean;
}

interface SelectFieldI extends BaseSelectProps {
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  options: SelectOption[];

  multiple?: boolean;

  variant?: "standard" | "outlined" | "filled";
  afterOnChange?: (value: SelectChangeEvent<any>) => void;
  onChangeReset: () => void;
  onOpen?: () => void
}

const SelectField = (props: SelectFieldI) => {
  //! State
  const {
    label,
    disabled = false,
    className,
    field,
    form,
    afterOnChange,
    options,
    sx,
    fullWidth = true,
    onChangeReset,
    variant,
    multiple,
    onOpen
  } = props;
  const { onBlur, value, name } = field;
  const { errors, touched, setFieldValue } = form || {};
  const classes = useStyles();
  const theme = useTheme();

  const errorMsg: any = get(errors, name);
  const isTouched = get(touched, name);
  const isShowMsg = isTouched && !!errorMsg;

  //! Function
  const handleChange = (e: SelectChangeEvent<any>) => {
    // alert('handleChange');
    try {
      setFieldValue(name, e.target.value as string);
      onChangeReset && onChangeReset();
      // onChange(e.target.value);
      if (afterOnChange) {
        afterOnChange(e.target.value);
      }
    } catch (error) {
      console.log("err", error);
    }
  };
  //! Render
  const renderOptions = () => {
    if (isArray(options)) {
      if (options.length === 0) {
        return <MenuItem disabled>No options</MenuItem>;
      }
      return options?.map((option) => {
        return (
          <MenuItem
            key={option?.value}
            value={option?.value}
            className={classes.listSubMenu}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative !important",
              "& :hover .listSubMenu": {
                display: "block !important",
              },
            }}
          >
            {option?.label}
            {/* <KeyboardArrowRight /> */}
            {/* <List sx={{ position: "absolute", top: 0, left: "100%" }} className="listSubMenu">
              <ListItem>sub 1</ListItem>
              <ListItem>sub 2</ListItem>
              <ListItem>sub 3</ListItem>
            </List> */}
          </MenuItem>
        );
      });
    }

    return null;
  };

  return (
    <FormControl fullWidth={fullWidth} variant={variant}>
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        labelId={name}
        id={name}
        name={name}
        value={value?.toString() || ""}
        label={label}
        onChange={handleChange}
        onBlur={onBlur}
        onOpen={onOpen}
        className={className}
        disabled={disabled}
        sx={sx}
        error={isShowMsg}
        multiple={multiple}
      // open={true}
      >
        {renderOptions()}
      </Select>
      {isShowMsg && (
        <FormHelperText
          sx={{
            color: theme.palette.error.main,
          }}
        >
          {errorMsg}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectField;
