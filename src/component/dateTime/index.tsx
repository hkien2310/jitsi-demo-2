import { Box, SxProps } from '@mui/material';
import { DesktopDatePicker, MobileDatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FieldInputProps, FormikProps, getIn } from 'formik';
import { isNull } from 'lodash';
import React, { ReactNode, useMemo } from 'react';

interface IDateTimePickerField {
  type?: string;
  label?: string;
  disabled?: boolean;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  sxContainer?: SxProps;
  isMobileDatePicker?: boolean;
  text?: ReactNode;
  icon?: React.ElementType<any>;
  formatCustom?: string;
  isDayjs?: boolean;
  afterOnChange?: (date: any) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateTimePickerField = (props: IDateTimePickerField) => {
  //! State
  const {
    field,
    form,
    label,
    disabled,
    sxContainer,
    isMobileDatePicker = false,
    text,
    icon,
    formatCustom,
    isDayjs,
    afterOnChange,
    minDate,
    maxDate,
  } = props;

  const { errors, touched } = form || {};
  const { name, value, onBlur } = field || {};

  const isTouched = getIn(touched, name!);
  const errorMessage = getIn(errors, name!);

  const valueDate = useMemo(() => {
    if (isDayjs) {
      return value ? dayjs(value) : null;
    }

    return value;
  }, [isDayjs, value]);

  //! Function
  const handleChange = (date: any, context: any) => {
    let result = date;

    if (isDayjs) {
      result = dayjs(result).toDate();
    }
    form.setFieldValue(name, result);

    afterOnChange && afterOnChange(result);
  };

  //! Render
  if (isMobileDatePicker) {
    return (
      <Box>
        {text}
        <DateTimePicker
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          label={label}
          value={value}
          slotProps={{
            textField: {
              onBlur,
              name,
              id: name,
              error: isTouched && Boolean(errorMessage),
              helperText: isTouched && errorMessage,
            },
          }}
          format={'YYYY-MM-DD HH:mm:ss'}
          onChange={handleChange}
          sx={{
            '& div': {
              borderRadius: '8px',
              '& input': {
                padding: '8.5px 14px',
              },
            },
            ...sxContainer,
          }}
          {...props}
        />
      </Box>
    );
  }

  return (
    <DateTimePicker
      disabled={disabled}
      label={label}
      value={valueDate}
      minDate={minDate}
      maxDate={maxDate}
      slotProps={{
        textField: {
          onBlur,
          name,
          id: name,
          error: isTouched && Boolean(errorMessage),
          helperText: isTouched && errorMessage,
        },
        // actionBar: value
        //   ? {
        //     actions: ['clear'],
        //   }
        //   : undefined,
      }}
      // slots={
      //   icon
      //     ? {
      //         openPickerIcon: icon,
      //       }
      //     : undefined
      // }
      onAccept={(newDate) => {
        if (isNull(newDate)) {
          form.setFieldValue(name, undefined);
        }
      }}
      format={formatCustom ? formatCustom : 'YYYY-MM-DD HH:mm:ss'}
      onChange={handleChange}
      sx={{
        '& label': {
          top: '-8px',
          '&.MuiInputLabel-shrink': {
            top: 0,
          },
        },
        '& div': {
          borderRadius: '8px',
          '& input': {
            padding: '8.5px 14px',
          },
        },
        ...sxContainer,
      }}
      {...props}
    />
  );
};

export default DateTimePickerField;