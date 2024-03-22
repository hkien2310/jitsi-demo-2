import { Box } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import { FieldInputProps, FormikHelpers, FormikProps, getIn } from "formik";
import { useState } from "react";

interface Props {
  field?: FieldInputProps<any>;
  form?: FormikProps<any> & FormikHelpers<any>;
  disabled?: boolean;
  height?: number;
  initialValue?: string;
}
function TinyMce({
  field,
  form,
  disabled = false,
  height = 300,
  initialValue,
  ...props
}: Props & IAllProps) {
  const { name, value, onBlur, onChange } = field || {};

  const { errors, touched } = form || {};
  const isTouched = getIn(touched, name!);
  const errorMessage = getIn(errors, name!);
  const [isFocus, setFocus] = useState<Boolean>(false);

  const onEditorChange = (val: string) => {
    // console.log("val", val);
    onChange &&
      onChange({
        target: {
          name,
          value: val,
        },
      });
  };

  return (
    <Box className="App">
      <Box
        className="MuiOutlinedInput-input"
        sx={{
          width: "100%",
          borderRadius: "0.5rem",
          borderStyle: "solid",
          borderWidth: isFocus ? 2 : 1,
          borderColor:
            isTouched && errorMessage
              ? red[500]
              : isFocus
              ? blue[600]
              : "#cccccc",
        }}
      >
        <Editor
          disabled={disabled}
          onBlur={onBlur}
          onFocusIn={() => setFocus(true)}
          onFocusOut={() => setFocus(false)}
          name={name}
          apiKey={`5mol7vhovgn0ilayv88c5yyaa5u5nu3na5co5pushdwrspem`}
          initialValue={initialValue}
          value={value}
          init={{
            height: height,
            menubar: true,
            config: {},
            language: "vi",
            selector: "textarea",
            // skin: 'oxide-dark',
            // content_css: 'light',
            plugins: [
              "advlist",
              "anchor",
              "autolink",
              "charmap",
              "code",
              "fullscreen",
              "help",
              "image",
              "insertdatetime",
              "link",
              "lists",
              "media",
              "preview",
              "searchreplace",
              "table",
              "visualblocks",
              "accordion",
            ],
            toolbar:
              "undo redo |link image accordion | styles | bold italic underline strikethrough | align | bullist numlist",
          }}
          // onChange={_onChange2}
          onEditorChange={onEditorChange}
          {...props}
        />
      </Box>
      {isTouched && errorMessage && (
        <p
          className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained Mui-required css-1wc848c-MuiFormHelperText-root"
          id=":r3v:-helper-text"
        >
          {errorMessage}
        </p>
      )}
    </Box>
  );
}

export default TinyMce;