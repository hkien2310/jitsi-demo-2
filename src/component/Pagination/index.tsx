import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PaginationItem from '@mui/material/PaginationItem';
import { colors } from '../../const/colors';

interface IProps {
  page: number
  totalPage: number
  handleChangePage: (page: number) => void
}

export default function PaginationCommon(props: IProps) {
  const { page, handleChangePage, totalPage } = props

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    handleChangePage(value)
  };

  return (
    <Stack spacing={2}>
      <Pagination
        // count={10}
        count={totalPage} 
        shape="rounded"
        page={page}
        showFirstButton
        showLastButton
        onChange={handleChange}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              border: `1px solid ${colors.border.pagination}`,
              width: '42px',
              height: '36px',
              borderRadius: '15px'
            }}
          />
        )}
        siblingCount={0}
      />
    </Stack>
  );
}