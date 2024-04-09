import Pagination from '@mui/material/Pagination';
import React from 'react';

const CustomPagination = ({ page, onPageChange, count }: any) => {
  return (
    <Pagination
      color="primary"
      count={count}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
};

export default CustomPagination;
