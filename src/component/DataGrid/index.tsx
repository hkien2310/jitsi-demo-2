import React from 'react'
import { styled } from '@mui/material/styles';
import {
    DataGrid,
    DataGridProps,
} from '@mui/x-data-grid';
import { colors } from '../../const/colors';


const DataGridCommon = (props: DataGridProps) => {
    return <DataGrid
    pageSizeOptions={[10]}
    checkboxSelection={false}
    disableRowSelectionOnClick
    disableColumnFilter
    disableColumnMenu
    disableColumnSelector
    columnBuffer={10}
    paginationMode="server"
    sortingMode="server"
    rowSpacingType={"margin"}
    hideFooter
    // hideFooterPagination={true}
    sx={{
      textAlign: "center",
      color: colors.text.tableContent,
      "& .MuiDataGrid-columnHeader": {
        border: `1px solid ${colors.border.main}`,
      },
      "& .MuiDataGrid-columnHeaders": {
        // background: blue["A100"],
        "& .MuiDataGrid-columnSeparator": {
          display: "none",
        },
        background: colors.background.tableHeader,
        color: "black",
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "500",
        },
      },
    }}
    {...props}
  />
}

export default DataGridCommon