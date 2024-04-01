import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PaginationItem from '@mui/material/PaginationItem';
import { colors } from '../../const/colors';
import { IconsSource } from '../../const/icons';

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
            slots={{ 
              previous: IconsSource.KeyboardArrowLeftIcon, 
              next: IconsSource.KeyboardArrowRightIcon,
              first: IconsSource.KeyboardDoubleArrowLeftIcon,
              last: IconsSource.KeyboardDoubleArrowRightIcon
            }}
            sx={{
              border: `1px solid ${colors.border.pagination}`,
              width: '42px',
              height: '36px',
              borderRadius: '15px'
            }}
          />
        )}
        siblingCount={1}
      />
    </Stack>
  );
}