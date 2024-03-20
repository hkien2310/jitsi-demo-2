import React from 'react'
import { styled } from '@mui/material/styles';
import {
    DataGrid,
    DataGridProps,
    GridColDef,
} from '@mui/x-data-grid';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& ::-webkit-scrollbar': {
        backgroundColor: '#FFF',
        width: '16px',
    },

    '& ::-webkit-scrollbar-track': {
        backgroundColor: '#FFF',
    },

    '& ::-webkit-scrollbar-track:hover': {
        backgroundColor: '#F4F4F4',
    },

    '& ::-webkit-scrollbar-thumb': {
        backgroundColor: '#808080',
        borderRadius: '16px',
        border: '5px solid #FFF',
    },

    '& ::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#808080',
        border: '4px solid #F4F4F4',
    },

    '& ::-webkit-scrollbar-button': { display: 'none' },
}));

const DataGridCommon = (props: DataGridProps) => {
    return <StyledDataGrid
    {...props}
    />
}

export default DataGridCommon