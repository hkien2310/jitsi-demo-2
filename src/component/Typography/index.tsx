import { Typography, TypographyProps } from "@mui/material"

const TypographyCommon = (props: TypographyProps) => {
    return <Typography
        style={{ color: 'black'}}
        {...props}
    />
}
export default TypographyCommon