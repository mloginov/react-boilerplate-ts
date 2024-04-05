import React, { SyntheticEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import { DataGrid, GridCallbackDetails, GridColDef, GridEventListener, GridSortModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import { keepPreviousData } from '@tanstack/react-query';
import MuiPagination from '@mui/material/Pagination';

import { useAccounts } from '../features/accounts';
import { Account } from '../api/accounts-manager';
dayjs.extend(relativeTime);

const PAGE_SIZE = 20;

const columns: GridColDef<Account>[] = [
  { field: 'userName', headerName: 'Username', flex: 1, minWidth: 200 },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 150,
    valueGetter: (value: Date) => dayjs(value).fromNow(),
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    width: 150,
    valueGetter: (value: Date) => dayjs(value).fromNow(),
  },
  { field: 'projects', headerName: 'Projects', width: 100, type: 'number' },
  { field: 'connections', headerName: 'Connections', width: 100, type: 'number' },
];

const CustomPagination = ({ page, onPageChange, count }: any) => {
  return (
    <MuiPagination
      color="primary"
      count={count}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
};

const Accounts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 0;
  const accounts = useAccounts(page, { placeholderData: keepPreviousData });
  const navigate = useNavigate();
  const getSortModelFromQuery = () => {
    if (!searchParams.get('field') || !searchParams.get('sort')) {
      return [];
    }
    const sort = searchParams.get('sort');
    return [
      {
        field: searchParams.get('field') as string,
        sort: sort === 'asc' ? ('asc' as const) : sort === 'desc' ? ('desc' as const) : null,
      },
    ];
  };
  const sortModel: GridSortModel = getSortModelFromQuery();

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    for (const pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  if (accounts.isError) {
    return <Alert severity="error">Load accounts failed.</Alert>;
  }
  if (accounts.isPending || !accounts.data) {
    return <CircularProgress />;
  }

  const onRowClick: GridEventListener<'rowClick'> = (params) => {
    navigate(params.row.id);
  };
  const onSortModelChange = (model: GridSortModel, _details: GridCallbackDetails) => {
    if (model[0]?.sort) {
      searchParams.set('field', model[0].field);
      searchParams.set('sort', model[0].sort);
    } else {
      searchParams.delete('field');
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  };

  const onPageChange = (_event: any, newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };
  return (
    <>
      <Badge badgeContent={accounts.data?.totalCount} color="primary" max={100000}>
        <Typography variant="h3" component="h1">
          Accounts
        </Typography>
        <Divider />
      </Badge>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ maxWidth: 300 }}>
          <Stack gap={1}>
            <TextField name="username" label="Username" variant="outlined" size="small" />
            <TextField name="id" label="Id" variant="outlined" size="small" />
            <TextField name="email" type="email" label="Email" variant="outlined" size="small" />
            <TextField name="project" label="Project" variant="outlined" size="small" />
            <TextField name="Backend domain" label="domain" variant="outlined" size="small" />
            <FormControlLabel control={<Checkbox name="Suspended" />} label="Suspended" />
          </Stack>
          <Stack direction="row" gap={1}>
            <Button variant="contained" type="submit">
              Search
            </Button>
            <Button variant="text">Reset</Button>
          </Stack>
        </Box>
      </Paper>
      <Box sx={{ marginTop: 1 }}>
        <DataGrid
          slots={{ pagination: CustomPagination }}
          slotProps={{ pagination: { count: Math.ceil(accounts.data.totalCount / PAGE_SIZE), page, onPageChange } }}
          rows={accounts.data.accounts}
          columns={columns}
          pageSizeOptions={[PAGE_SIZE]}
          disableRowSelectionOnClick
          onRowClick={onRowClick}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
        ></DataGrid>
      </Box>
    </>
  );
};

export default Accounts;
