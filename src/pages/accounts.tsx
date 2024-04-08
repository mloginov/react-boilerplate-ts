import React, { SyntheticEvent, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import { DataGrid, GridCallbackDetails, GridColDef, GridEventListener, GridSortModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import { keepPreviousData } from '@tanstack/react-query';

import { useAccounts } from '../features/accounts';
import { Account, AccountViewFilter } from '../api/accounts-manager';
import { getSortModelFromQuery } from '../components/helpers';

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

const getFiltersFromSearchParams = (searchParams: URLSearchParams): AccountViewFilter => {
  return {
    username: searchParams.get('username'),
    id: searchParams.get('id'),
    email: searchParams.get('email'),
    project: searchParams.get('project'),
    domain: searchParams.get('domain'),
    suspended: searchParams.get('suspended') === 'on',
    page: searchParams.has('page') ? parseInt(searchParams.get('page') as string) : 0,
  };
};

const isSearchChanged = (oldFilter: AccountViewFilter, newFilter: AccountViewFilter) => {
  const { page: page1, ...restA } = oldFilter;
  const { page: page2, ...restB } = newFilter;
  return JSON.stringify(restA) !== JSON.stringify(restB);
};

const Accounts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortModel: GridSortModel = getSortModelFromQuery(searchParams);
  const [filter, setFilter] = useState(() => getFiltersFromSearchParams(searchParams));
  const [formData, setFormData] = useState(filter);
  useEffect(() => {
    const f = getFiltersFromSearchParams(searchParams);
    isSearchChanged(filter, f) || (searchParams.toString() === '' && setFormData(f));
    setFilter(f);
  }, [searchParams]);
  const view = {
    filter,
    sort: !!sortModel[0]?.sort ? sortModel[0] : null,
  };
  const accounts = useAccounts(view, { placeholderData: keepPreviousData });
  const navigate = useNavigate();

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const newSearchParams = new URLSearchParams(searchParams);
    for (const pair of data.entries()) {
      if (pair[1]) {
        newSearchParams.set(pair[0], pair[1].toString());
      } else {
        newSearchParams.delete(pair[0]);
      }
    }
    setSearchParams(newSearchParams);
  };
  const onReset = (e: SyntheticEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);
    setFormData(getFiltersFromSearchParams(newSearchParams));
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
    const newSearchParams = new URLSearchParams(searchParams);
    if (model[0]?.sort) {
      newSearchParams.set('field', model[0].field);
      newSearchParams.set('sort', model[0].sort);
    } else {
      newSearchParams.delete('field');
      newSearchParams.delete('sort');
    }
    setSearchParams(newSearchParams);
  };

  const onPageChange = (_event: any, newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    setSearchParams(newSearchParams);
  };
  const onControlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.name !== 'suspended' ? event.target.value : event.target.checked,
    });
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
            <TextField
              name="username"
              label="Username"
              variant="outlined"
              size="small"
              value={formData.username || ''}
              onChange={onControlChange}
            />
            <TextField
              name="id"
              label="Id"
              variant="outlined"
              size="small"
              value={formData.id || ''}
              onChange={onControlChange}
            />
            <TextField
              name="email"
              type="email"
              label="Email"
              variant="outlined"
              size="small"
              value={formData.email || ''}
              onChange={onControlChange}
            />
            <TextField
              name="project"
              label="Project"
              variant="outlined"
              size="small"
              value={formData.project || ''}
              onChange={onControlChange}
            />
            <TextField
              name="domain"
              label="Backend domain"
              variant="outlined"
              size="small"
              value={formData.domain || ''}
              onChange={onControlChange}
            />
            <FormControlLabel
              control={<Checkbox name="suspended" checked={formData.suspended} onChange={onControlChange} />}
              label="Suspended"
            />
          </Stack>
          <Stack direction="row" gap={1}>
            <Button variant="contained" type="submit">
              Search
            </Button>
            <Button variant="text" onClick={onReset}>
              Reset
            </Button>
          </Stack>
        </Box>
      </Paper>
      <Box sx={{ marginTop: 1 }}>
        <DataGrid
          slots={{ pagination: CustomPagination }}
          slotProps={{
            pagination: { count: Math.ceil(accounts.data.totalCount / PAGE_SIZE), page: filter.page, onPageChange },
          }}
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
