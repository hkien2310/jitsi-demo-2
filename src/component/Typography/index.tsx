import { Typography, TypographyProps } from "@mui/material"

const TypographyCommon = (props: TypographyProps) => {
    return <Typography
        style={{ color: 'black', }}
        {...props}
        sx={{fontFamily: '-apple-system,BlinkMacSystemFont,open_sanslight,"Helvetica Neue",Helvetica,Arial,sans-serif !important', ...props?.sx}}
    />
}
export default TypographyCommon