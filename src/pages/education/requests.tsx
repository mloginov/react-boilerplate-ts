import React, { SyntheticEvent } from 'react';
import { RequestState, RequestType } from '../../api/requests-manager';
import { useSearchParams } from 'react-router-dom';
import { useRequests } from '../../features/requests';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RequestsTabs from '../requests/tabs';

interface RequestsProps {
  type: RequestType;
}

const Requests = ({ type }: RequestsProps) => {
  const requests = useRequests({ type });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchSettings, setSearchSettings] = React.useState({ value: '', active: false });
  const onTabChange = (tab: string) => {
    setSearchParams(new URLSearchParams({ tab }));
  };
  if (requests.isError) {
    return <Alert severity="error">Load requests data failed.</Alert>;
  }
  if (requests.isPending || !requests.data) {
    return <CircularProgress />;
  }

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const search = data.get('search');
    if (search) {
      setSearchSettings({ value: search as string, active: true });
    }
  };
  const onReset = (e: SyntheticEvent) => {
    e.preventDefault();
    setSearchSettings({ value: '', active: false });
  };

  const onControlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSettings({ ...searchSettings, value: event.target.value });
  };

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ maxWidth: 600 }}>
          <Stack spacing={1} direction="row">
            <TextField
              name="search"
              label="Search"
              variant="outlined"
              size="small"
              value={searchSettings.value || ''}
              onChange={onControlChange}
            />
            <Button variant="contained" type="submit">
              Search
            </Button>
            <Button variant="text" onClick={onReset}>
              Reset
            </Button>
          </Stack>
        </Box>
      </Paper>
      <RequestsTabs
        requests={requests.data}
        tab={searchParams.get('tab') || RequestState.REQUEST}
        onTabChange={onTabChange}
      />
    </Stack>
  );
};

export default Requests;
