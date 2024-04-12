import React, { SyntheticEvent, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import { DataGrid, GridCallbackDetails, GridColDef, GridEventListener, GridSortModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import { keepPreviousData } from '@tanstack/react-query';
import EmailIcon from '@mui/icons-material/Email';

import { getSortModelFromQuery } from '../components/helpers';
import CustomPagination from '../components/helpers/custom-grid-pagination';
import { Link } from '@mui/material';
import { OrganizationShort, OrganizationViewFilter } from '../api/organizations-manager';
import { useOrganizations } from '../features/organizations';

dayjs.extend(relativeTime);

const PAGE_SIZE = 20;

const columns: GridColDef<OrganizationShort>[] = [
  {
    field: 'email',
    headerName: '',
    width: 50,
    renderCell: (params) => {
      return (
        <Link href={`mailto:${params.row.email}`} onClick={(e) => e.stopPropagation()}>
          <EmailIcon sx={{ height: '100%' }} />
        </Link>
      );
    },
  },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
];

const getFiltersFromSearchParams = (searchParams: URLSearchParams): OrganizationViewFilter => {
  return {
    name: searchParams.get('name'),
    slug: searchParams.get('slug'),
    email: searchParams.get('email'),
    page: searchParams.has('page') ? parseInt(searchParams.get('page') as string) : 0,
  };
};

const isSearchChanged = (oldFilter: OrganizationViewFilter, newFilter: OrganizationViewFilter) => {
  const { page: page1, ...restA } = oldFilter;
  const { page: page2, ...restB } = newFilter;
  return JSON.stringify(restA) !== JSON.stringify(restB);
};

const Organizations = () => {
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
  const organizations = useOrganizations(view, { placeholderData: keepPreviousData });
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

  if (organizations.isError) {
    return <Alert severity="error">Load accounts failed.</Alert>;
  }
  if (organizations.isPending || !organizations.data) {
    return <CircularProgress />;
  }

  const onRowClick: GridEventListener<'rowClick'> = (params, p2, p3) => {
    console.log('onRowClick', p2, p3);
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
      [event.target.name]: event.target.value,
    });
  };
  return (
    <>
      <Badge badgeContent={organizations.data?.totalCount} color="primary" max={100000}>
        <Typography variant="h3" component="h1">
          Organizations
        </Typography>
        <Divider />
      </Badge>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ maxWidth: 300 }}>
          <Stack spacing={1}>
            <Stack spacing={1}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                size="small"
                value={formData.name || ''}
                onChange={onControlChange}
              />
              <TextField
                name="slug"
                label="Slug"
                variant="outlined"
                size="small"
                value={formData.slug || ''}
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
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" type="submit">
                Search
              </Button>
              <Button variant="text" onClick={onReset}>
                Reset
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
      <Box sx={{ marginTop: 1 }}>
        <DataGrid
          slots={{ pagination: CustomPagination }}
          slotProps={{
            pagination: {
              count: Math.ceil(organizations.data.totalCount / PAGE_SIZE),
              page: filter.page,
              onPageChange,
            },
          }}
          rows={organizations.data.organizations}
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

export default Organizations;
