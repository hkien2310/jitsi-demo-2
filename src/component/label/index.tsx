import { Box } from "@mui/material";

interface Props {
  label: string;
  isFlex?: boolean
}
const LabelCommon = (props: Props) => {
  const { label} = props;
  return (
    <Box sx={{ color: "black", flex: 1,  mr: 2 }}>
      {label}: <span style={{ color: "red" }}> *</span>
    </Box>
  );
};
export default LabelCommon;
