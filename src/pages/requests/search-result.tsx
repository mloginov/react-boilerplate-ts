import React from 'react';
import Typography from '@mui/material/Typography';

import { Request } from '../../api/requests-manager';
import RequestsGrid from './grid';

interface RequestsSearchResultProps {
  searchText: string;
  requests: Request[];
}

const RequestsSearchResult = ({ searchText, requests }: RequestsSearchResultProps) => {
  return (
    <>
      <Typography variant="h5" component="h2" sx={{ flex: 1 }} color="textSecondary">
        Search results for &quot;{searchText}&quot;
      </Typography>
      <RequestsGrid requests={requests} showActionsColumn={true} />
    </>
  );
};

export default RequestsSearchResult;
