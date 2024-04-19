import React from 'react';
import { GridColDef, GridEventListener, GridToolbar } from '@mui/x-data-grid';
import { OwnerInfo } from '../../../api/organizations-manager';
import { useNavigate } from 'react-router-dom';
import StripedDataGrid from '../../../components/helpers/striped-data-grid';

const columns: GridColDef<OwnerInfo>[] = [{ field: 'username', headerName: 'Username', flex: 1 }];

interface OwnersProps {
  owners: OwnerInfo[];
}

const Owners = ({ owners }: OwnersProps) => {
  const navigate = useNavigate();
  const onRowClick: GridEventListener<'rowClick'> = (params) => {
    navigate(`/accounts/${params.row.id}`);
  };
  return (
    <StripedDataGrid
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
    ></StripedDataGrid>
  );
};

export default Owners;
