import React, {SyntheticEvent} from 'react';
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
  Typography
} from "@mui/material";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import dayjs from 'dayjs'

import {useAccounts} from "../features/accounts";
import {IAccount} from "../api/accounts-manager";
import {useSearchParams} from "react-router-dom";

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const columns: GridColDef<IAccount>[] = [
  {field: 'userName', headerName: 'Username', flex: 1, minWidth: 200},
  {field: 'email', headerName: 'Email', flex: 1, minWidth: 200},
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 150,
    valueGetter: (value: Date) => dayjs(value).fromNow()
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    width: 150,
    valueGetter: (value: Date) => dayjs(value).fromNow()
  },
  {field: 'projects', headerName: 'Projects', width: 100, type: "number"},
  {field: 'connections', headerName: 'Connections', width: 100, type: "number"},
]

const Accounts = () => {
  const [searchParams, /*setSearchParams*/] = useSearchParams()
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 0
  const accounts = useAccounts(page)

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    const data = new FormData(e.target as HTMLFormElement)
    for (const pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
  }

  if (accounts.isFetching) {
    return <CircularProgress />
  }
  if (accounts.isError) {
    // todo show retry action
    return <Alert severity="error">Load accounts failed.</Alert>
  }

  return (
    <>
      <Badge badgeContent={15348} color="primary" max={100000}>
        <Typography variant='h3' component='h1'>
          Accounts
        </Typography>
        <Divider />
      </Badge>
      <Paper variant='outlined' sx={{padding: 2}}>
        <Box component='form' noValidate onSubmit={onSubmit} sx={{maxWidth: 300}}>
          <Stack gap={1}>
            <TextField name='username' label="Username" variant="outlined" size='small' />
            <TextField name="id"  label="Id" variant="outlined" size='small' />
            <TextField name="email" type='email' label="Email" variant="outlined" size='small' />
            <TextField name="project" label="Project" variant="outlined" size='small' />
            <TextField name="Backend domain" label="domain" variant="outlined" size='small' />
            <FormControlLabel control={<Checkbox name='Suspended' />} label="Suspended" />
          </Stack>
          <Stack direction='row' gap={1}>
            <Button variant="contained" type='submit'>Search</Button>
            <Button variant="text">Reset</Button>
          </Stack>
        </Box>
      </Paper>
      <Box sx={{height: 1151, marginTop: 1}}>
        <DataGrid
          rows={accounts.data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[20]}
          disableRowSelectionOnClick
        ></DataGrid>
      </Box>
    </>
  )
};

export default Accounts;
