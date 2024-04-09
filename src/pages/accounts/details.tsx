import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccountDetails } from '../../features/accounts';
import { keepPreviousData } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { grey } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';

import Subscription from './details/subscription';
import EducationStatus from './details/education-status';
import Projects from './details/projects';
import Details from './details/details';
import IPs from './details/ips';

const AccountDetails = () => {
  const params = useParams();
  console.log('AccountDetails params', params);
  const accountInfo = useAccountDetails(params.id || '', { placeholderData: keepPreviousData });
  const [activeTab, setActiveTab] = useState('0');
  if (accountInfo.isError) {
    return <Alert severity="error">Load account data failed.</Alert>;
  }
  if (accountInfo.isPending || !accountInfo.data) {
    return <CircularProgress />;
  }
  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          {accountInfo.data.fullName}
          <small style={{ color: grey[600], marginLeft: 10, fontSize: '0.7em' }}>{accountInfo.data.userName}</small>
        </Typography>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'flex-end' }}>
          <Button variant="contained" color="success" sx={{ whiteSpace: 'nowrap' }}>
            Login as incognito
          </Button>
          <Button variant="contained" color="error" sx={{ whiteSpace: 'nowrap' }}>
            Downgrade single login
          </Button>
          <Button variant="contained" color="error" sx={{ whiteSpace: 'nowrap' }}>
            Suspend
          </Button>
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={2} direction="row">
        <Link href={`mailto:${accountInfo.data.email}`} sx={{ flex: 1 }}>
          {accountInfo.data.email}
        </Link>
        <Stack spacing={1}>
          <Typography variant="body2">Codio id: {accountInfo.data.id}</Typography>
          <Typography variant="body2">Last login: {dayjs(accountInfo.data.lastLogin).fromNow()}</Typography>
          <Typography variant="body2">Created at: {dayjs(accountInfo.data.createdAt).fromNow()}</Typography>
        </Stack>
      </Stack>
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(_, tab) => setActiveTab(tab)} aria-label="lab API tabs example">
            <Tab label="Subscription" value="0" />
            <Tab label="Education Status" value="1" />
            <Tab label="Projects" value="2" />
            <Tab label="Details" value="3" />
            <Tab label="IPs" value="4" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <Subscription />
        </TabPanel>
        <TabPanel value="1">
          <EducationStatus />
        </TabPanel>
        <TabPanel value="2">
          <Projects />
        </TabPanel>
        <TabPanel value="3">
          <Details />
        </TabPanel>
        <TabPanel value="4">
          <IPs />
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

export default AccountDetails;
