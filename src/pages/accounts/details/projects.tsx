import React, { SyntheticEvent, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { keepPreviousData } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridSortModel,
} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

import CustomPagination from '../../../components/helpers/custom-grid-pagination';
import { AccountDetails } from '../../../api/accounts-manager';
import { getSortModelFromQuery } from '../../../components/helpers';
import { useProjects } from '../../../features/projects';
import { Project, ProjectsListView, ProjectsViewFilter } from '../../../api/projects-manager';

const PAGE_SIZE = 20;

const getFiltersFromSearchParams = (searchParams: URLSearchParams): ProjectsViewFilter => {
  return {
    name: searchParams.get('name'),
    page: searchParams.has('page') ? parseInt(searchParams.get('page') as string) : 0,
  };
};

const isSearchChanged = (oldFilter: ProjectsViewFilter, newFilter: ProjectsViewFilter) => {
  return oldFilter.name === newFilter.name;
};

interface ProjectsProps {
  accountInfo: AccountDetails;
}

const columns: GridColDef<Project>[] = [
  {
    field: 'private',
    headerName: '',
    width: 50,
    renderCell: (params: GridRenderCellParams<any, boolean>) => {
      if (params.value) {
        return <VisibilityOffIcon sx={{ height: '100%' }} />;
      }
      return <RemoveRedEyeIcon sx={{ height: '100%' }} />;
    },
  },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'fileServer', headerName: 'Fileserver', width: 200 },
  { field: 'id', headerName: 'Project Id', width: 300 },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 120,
    valueGetter: (value: Date) => dayjs(value).fromNow(),
  },
  {
    field: 'lastAccessed',
    headerName: 'Last Accessed',
    width: 120,
    valueGetter: (value: Date) => dayjs(value).fromNow(),
  },
];

const Projects = ({ accountInfo }: ProjectsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortModel = getSortModelFromQuery(searchParams);
  const [filter, setFilter] = useState(() => getFiltersFromSearchParams(searchParams));
  const [projectNameFilter, setProjectNameFilter] = useState(filter.name);
  const navigate = useNavigate();

  useEffect(() => {
    const f = getFiltersFromSearchParams(searchParams);
    isSearchChanged(filter, f) || (searchParams.toString() === '' && setProjectNameFilter(f.name));
    setFilter(f);
  }, [searchParams]);
  const view: ProjectsListView = {
    filter,
    sort: !!sortModel[0]?.sort ? sortModel[0] : null,
  };
  const projects = useProjects(view, { placeholderData: keepPreviousData });

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
    const newSearchParams = new URLSearchParams({ tab: searchParams.get('tab') || '0' });
    setSearchParams(newSearchParams);
    setProjectNameFilter(getFiltersFromSearchParams(newSearchParams).name);
  };
  const onRowClick: GridEventListener<'rowClick'> = (params) => {
    navigate(`/projects/${params.row.id}`, { relative: 'path' });
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
  const onSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectNameFilter(event.target.value);
  };

  if (projects.isError) {
    return <Alert severity="error">Load projects failed.</Alert>;
  }
  if (projects.isPending || !projects.data) {
    return <CircularProgress />;
  }
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ maxWidth: 300 }}>
          <Stack spacing={1}>
            <TextField
              name="name"
              label="name"
              variant="outlined"
              size="small"
              value={projectNameFilter || ''}
              onChange={onSearchNameChange}
            />
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
      <DataGrid
        slots={{ pagination: CustomPagination }}
        slotProps={{
          pagination: { count: Math.ceil(accountInfo.projectsCount / PAGE_SIZE), page: filter.page, onPageChange },
        }}
        rows={projects.data}
        columns={columns}
        pageSizeOptions={[PAGE_SIZE]}
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      ></DataGrid>
    </Stack>
  );
};

export default Projects;
