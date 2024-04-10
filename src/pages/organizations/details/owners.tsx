import React from 'react';
import { DataGrid, GridColDef, GridEventListener, GridToolbar } from '@mui/x-data-grid';
import { OwnerDetails } from '../../../api/organizations-manager';
import { useNavigate } from 'react-router-dom';

const columns: GridColDef<OwnerDetails>[] = [{ field: 'username', headerName: 'Username', flex: 1 }];

interface OwnersProps {
  owners: OwnerDetails[];
}

const Owners = ({ owners }: OwnersProps) => {
  const navigate = useNavigate();
  const onRowClick: GridEventListener<'rowClick'> = (params) => {
    navigate(`/accounts/${params.row.id}`);
  };
  return (
    <DataGrid
      rows={owners}
      columns={columns}
      disableColumnFilter
      disableColumnSelector
      disableDensitySelector
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          printOptions: { disableToolbarButton: true },
          csvOptions: { disableToolbarButton: true },
          showQuickFilter: true,
        },
      }}
      initialState={{
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      onRowClick={onRowClick}
      sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
    ></DataGrid>
  );
};

export default Owners;
