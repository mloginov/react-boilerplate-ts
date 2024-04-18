import React from 'react';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import TabPanel from '@mui/lab/TabPanel';
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Request, RequestState } from '../../api/requests-manager';
import { useNavigate } from 'react-router-dom';

interface RequestsTabsProps {
  requests: Request[];
  tab: string;
  onTabChange: (tab: string) => void;
}

const baseColumns: GridColDef<Request>[] = [
  {
    field: 'orgName',
    headerName: 'Org Name',
    flex: 1,
  },
  { field: 'userName', headerName: 'User', flex: 1 },
  { field: 'email', headerName: 'Email', width: 200 },
  {
    field: 'createdAt',
    headerName: 'Requested time',
    width: 170,
    renderCell: (params) => params.value.toLocaleString(),
  },
];

enum RequestAction {
  APPROVE,
  DENY,
  MOVE_TO_PENDING,
}

const getAdditionalColumns = (state: RequestState, onAction: (action: RequestAction) => void) => {
  switch (state) {
    case RequestState.MORE_INFO:
      return [
        {
          field: 'state',
          headerName: '',
          width: 200,
          renderCell: () => {
            return (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onAction(RequestAction.APPROVE)}
                  color="success"
                >
                  Approve
                </Button>
                <Button variant="contained" size="small" onClick={() => onAction(RequestAction.DENY)} color="error">
                  Deny
                </Button>
              </Stack>
            );
          },
        },
      ];
    case RequestState.DENIED:
      return [
        {
          field: 'state',
          headerName: '',
          width: 200,
          renderCell: () => {
            return (
              <Button
                variant="contained"
                size="small"
                onClick={() => onAction(RequestAction.MOVE_TO_PENDING)}
                color="info"
              >
                Move to Pending
              </Button>
            );
          },
        },
      ];
    case RequestState.APPROVED:
      return [
        {
          field: 'demoAt',
          headerName: 'Demo time',
          width: 170,
          renderCell: (params: GridRenderCellParams<any, boolean>) => params.value?.toLocaleString(),
        },
      ];
    case RequestState.REQUEST:
      return [];
  }
};

const getColumns = (state: RequestState, onAction: (action: RequestAction) => void) => {
  return [...baseColumns, ...getAdditionalColumns(state, onAction)];
};

const styles = {
  gridBase: {
    '& .MuiDataGrid-cell': { alignContent: 'center' },
  },
  gridApproved: {
    '& .MuiDataGrid-row': { cursor: 'pointer' },
  },
};

const RequestsTabs = ({ requests, tab, onTabChange }: RequestsTabsProps) => {
  const requestsCount = requests.filter((request) => request.state === RequestState.REQUEST).length || 0;
  const navigate = useNavigate();

  const onAction = (action: RequestAction) => {
    console.log('onAction', action);
  };
  const onRowClick: GridEventListener<'rowClick'> = (params) => {
    console.log('onRowClick', params);
    if (params.row.state === RequestState.APPROVED) {
      navigate(params.row.id);
    }
  };

  const getRequestsGrid = (state: RequestState) => {
    const data = requests.filter((request) => request.state === state);
    const sx = state === RequestState.APPROVED ? { ...styles.gridBase, ...styles.gridApproved } : styles.gridBase;
    return (
      <DataGrid
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        rows={data}
        columns={getColumns(state, onAction)}
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        sx={sx}
      ></DataGrid>
    );
  };
  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={(_, value) => onTabChange(value)}>
          <Tab
            label={
              <Badge badgeContent={requestsCount} color="primary" max={10000}>
                Requests
              </Badge>
            }
            value={RequestState.REQUEST}
          />
          <Tab label="Approved" value={RequestState.APPROVED} />
          <Tab label="More info" value={RequestState.MORE_INFO} />
          <Tab label="Denied" value={RequestState.DENIED} />
        </TabList>
      </Box>
      <TabPanel value={RequestState.REQUEST}>{getRequestsGrid(RequestState.REQUEST)}</TabPanel>
      <TabPanel value={RequestState.APPROVED}>{getRequestsGrid(RequestState.APPROVED)}</TabPanel>
      <TabPanel value={RequestState.MORE_INFO}>{getRequestsGrid(RequestState.MORE_INFO)}</TabPanel>
      <TabPanel value={RequestState.DENIED}>{getRequestsGrid(RequestState.DENIED)}</TabPanel>
    </TabContext>
  );
};

export default RequestsTabs;
