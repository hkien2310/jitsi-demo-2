import * as React from "react";
import TextField from "@mui/material/TextField";
import { Box, SxProps, useTheme } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { FieldInputProps, FormikProps, getIn } from "formik";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { SelectOption, SetBooleanState, SetOptionsValue } from "../../interface";
import Timer from "../../helper/timer";


interface Props {
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  label?: string;
  key: string;
  loadOptions: (text: string, setOptions: SetOptionsValue, setLoading: SetBooleanState) => void;
  multiple?: boolean;
  disableCloseOnSelect?: boolean;
  sx?: SxProps;
  sizeCustom: any;
  isSync?: boolean;
  options?: SelectOption[];
  loading?: boolean;
  fullWidth?: boolean;
  addable?: boolean;
  disabled?: boolean;
  required?: boolean;

  onChangeCustomize?: (event: any, value: SelectOption | null) => void;
  callbackOnOpen?: () => void;
  callbackOnClose?: () => void;
}

function AutoCompleteField(props: Props) {
  //! State
  const timer = React.useRef(new Timer());
  const theme = useTheme();
  const {
    field,
    form,
    options: propsOptions,
    loadOptions,
    label,
    key = "value",
    multiple,
    disableCloseOnSelect,
    sx,
    sizeCustom = "medium",
    isSync = true,
    addable = false,
    onChangeCustomize,
    callbackOnOpen,
    callbackOnClose,
    disabled,
    required
  } = props;

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<SelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const [text, setText] = React.useState<string>("");
  const { name, value, onBlur } = field || {};
  const { errors, touched } = form || {};

  const isTouched = getIn(touched, name);
  const errorMessage = getIn(errors, name);

  //! Function
  React.useEffect(() => {
    if (isSync) {
      setLoading(props?.loading || false);
      setOptions(props?.options || []);
    }
  }, [isSync, props.loading, props.options]);

  React.useEffect(() => {
    let active = true;
    if (!isSync) {
      (async () => {
        if (active) {
          timer.current.debounce(() => {
            loadOptions(text, setOptions, setLoading);
          }, 500);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [isSync, setOptions, text, setLoading]);

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  const handleChange = (event: any, value: SelectOption | null) => {
    if (onChangeCustomize) {
      onChangeCustomize(event, value);
      return;
    }

    form?.setFieldValue(name, value?.value);
  };

  //! Render
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Autocomplete
        id={name}
        multiple={multiple || false}
        sx={{
          ...sx,
          "& fieldset": {
            borderColor: isTouched && errorMessage ? theme.palette.error.dark : "rgba(0, 0, 0, 0.23)",
          },
        }}
        open={open}
        freeSolo={addable}
        filterOptions={
          addable
            ? (options, params) => {
              const filtered = options.filter((option) => {
                if (option.label.toLowerCase().includes(params.inputValue.toLowerCase())) {
                  return option;
                }
              });
              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some((option) => inputValue === option.label);
              const isExistingShouldTrim = options.some((option) => inputValue.trim() === option.label);

              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  value: `new:${inputValue}`,
                  label: inputValue,
                });
              }

              return filtered;
            }
            : undefined
        }
        // filterSelectedOptions
        disableCloseOnSelect={disableCloseOnSelect || false}
        onOpen={() => {
          setOpen(true);
          callbackOnOpen && callbackOnOpen();
        }}
        onClose={() => {
          setOpen(false);
          callbackOnClose && callbackOnClose();
        }}
        value={value}
        // onChange={handleChange}
        onChange={(event, value: any) => {
          handleChange(event, value)
        }}
        onInputChange={(event, newInputValue) => {
          setText(newInputValue);
        }}
        onBlur={onBlur}
        inputValue={text}
        isOptionEqualToValue={(option: any, value: any) => {
          return option[key] === value[key];
        }}
        getOptionLabel={(option: string | SelectOption) => {
          if (typeof option === "string") {
            return option;
          }
          return option.label;
        }}
        getOptionKey={(option: string | SelectOption) => {
          if (typeof option === "string") {
            return option;
          }
          return option.value;
        }}
        options={propsOptions || options}
        fullWidth
        loading={loading}
        disabled={disabled}
        size={sizeCustom || "medium"}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            name={name}
            variant="outlined"
            required={required}
            onBlur={onBlur}
            error={isTouched && Boolean(errorMessage)}
            helperText={isTouched && errorMessage}
            fullWidth
            sx={{
              "& div": {
                borderRadius: "0.5rem",
                "& .MuiChip-filled": {
                  backgroundColor: 'rgba(140, 150, 160, 0.4)'
                }
              },
              "& label": {
                "& .MuiFormLabel-asterisk": {
                  color: 'red'
                }
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      {/* {isTouched && errorMessage && (
        <Box
          sx={{
            fontWeight: 400,
            fontSize: "0.75rem",
            lineHeight: 1.66,
            textAlign: "left",
            margin: "0.25rem 0.875rem 0 0.875rem",
            color: theme.palette.error.light,
          }}
        >
          {errorMessage}
        </Box>
      )} */}
    </Box>
  );
}

export default AutoCompleteField;
