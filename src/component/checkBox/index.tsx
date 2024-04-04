import React, { useMemo, useState } from 'react';
import { Checkbox as CheckboxMui, CheckboxProps, Stack, SxProps } from '@mui/material';
import { FieldInputProps, FormikProps, getIn } from 'formik';
import { isArray, isArrayBuffer, isEmpty, isEqual } from 'lodash';
import { useTheme } from '@mui/material';
import { Box } from "@mui/material";


export type ITextFieldProps = CheckboxProps & {
  field?: FieldInputProps<any>;
  form?: FormikProps<any>;
  label: string;
  sxContainer?: SxProps;
  sx?: SxProps;
  sxLabel?: SxProps;
  sxWrapper?: SxProps;
  customHandleChange: (value: any) => void
};

const CheckBoxField = (props: ITextFieldProps) => {
  //! Define
  const { field, form, label, className, sxContainer, sx, sxLabel, sxWrapper, ...rest } = props;
  const { errors, touched, values, setFieldValue } = form || {};
  const { name, value } = field || {};
  const theme = useTheme();

  const isTouched = getIn(touched, name!);
  const errorMessage = getIn(errors, name!);
  //! Functions
  const handleChange = () => {
    if (setFieldValue && name) {
      setFieldValue(name, !value);
    }
  };

  //! Render
  return (
    // <Stack direction='row' spacing={1} alignItems={'center'}>
    <Box
      sx={{
        display: 'flex',
        // alignItems: 'center',
        // gap: '1rem',
        flexDirection: 'column',
        ...sxWrapper,
      }}
    >
      <Box
        sx={{ display: 'flex', gap: '1rem', ...sxContainer }}
      >
        <CheckboxMui
          className={className}
          checked={!!value}
          onChange={handleChange}
          sx={{ padding: 0, ...sx }}
          {...rest}
        />
        {label && (
          <Box onClick={handleChange} sx={sxLabel}>
            {label}
          </Box>
        )}
      </Box>
      {isTouched && errorMessage && (
        <Box
          sx={{
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 1.66,
            textAlign: 'left',
            margin: '0.25rem 0.875rem 0 0.875rem',
            color: 'red',
          }}
        >
          {errorMessage}
        </Box>
      )}
    </Box>

    // </Stack>
  );
};

export default CheckBoxField;