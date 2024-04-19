import React from 'react';
import { GridColDef, GridEventListener, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { getActionButtonsByState, RequestAction } from './helpers';
import { Request, RequestState } from '../../api/requests-manager';
import StripedDataGrid from '../../components/helpers/striped-data-grid';

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

const demoColumn: GridColDef<Request> = {
  field: 'demoAt',
  headerName: 'Demo time',
  width: 170,
  renderCell: (params: GridRenderCellParams<any, boolean>) => params.value?.toLocaleString(),
};

const getActionsColumn = (onAction: (action: RequestAction) => void): GridColDef<Request> => {
  return {
    field: 'state',
    headerName: '',
    width: 170,
    renderCell: (params) => getActionButtonsByState(params.row.state, onAction),
  };
};

const styles = {
  '& .MuiDataGrid-cell': { alignContent: 'center' },
  '& .MuiDataGrid-row.dataGridRow--clickable': { cursor: 'pointer' },
};

interface RequestsGridProps {
  requests: Request[];
  showActionsColumn?: boolean;
  showDemoColumn?: boolean;
}

const RequestsGrid = ({ requests, showActionsColumn, showDemoColumn }: RequestsGridProps) => {
  const navigate = useNavigate();

  const onAction = (action: RequestAction) => {
    console.log('onAction', action);
  };

  const getColumns = (onAction: (action: RequestAction) => void) => {
    const columns = [...baseColumns];
    showDemoColumn && columns.push(demoColumn);
    showActionsColumn && columns.push(getActionsColumn(onAction));
    return columns;
  };

  const onRowClick: GridEventListener<'rowClick'> = (params) => {
    console.log('onRowClick', params);
    if (params.row.state === RequestState.APPROVED) {
      navigate(params.row.id);
    }
  };

  return (
    <StripedDataGrid
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      rows={requests}
      columns={getColumns(onAction)}
      disableRowSelectionOnClick
      onRowClick={onRowClick}
      sx={styles}
    />
  );
};

export default RequestsGrid;
