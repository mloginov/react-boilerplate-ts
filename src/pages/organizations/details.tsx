import React, { SyntheticEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

import Subscription from './details/subscription';
import EducationStatus from './details/education-status';
import Owners from './details/owners';
import Details from './details/details';
import { useOrganizationDetails } from '../../features/organizations';

const OrganizationDetails = () => {
  const params = useParams();
  const organizationInfo = useOrganizationDetails(params.id || '', { placeholderData: keepPreviousData });
  const [searchParams, setSearchParams] = useSearchParams();
  const onTabChange = (_: SyntheticEvent, tab: any) => {
    setSearchParams(new URLSearchParams({ tab }));
  };
  if (organizationInfo.isError) {
    return <Alert severity="error">Load organization data failed.</Alert>;
  }
  if (organizationInfo.isPending || !organizationInfo.data) {
    return <CircularProgress />;
  }
  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          {organizationInfo.data.name}
          <small style={{ color: grey[600], marginLeft: 10, fontSize: '0.7em' }}>{organizationInfo.data.slug}</small>
        </Typography>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'flex-end' }}>
          <Button variant="contained" color="success" sx={{ whiteSpace: 'nowrap' }}>
            Generate invoice
          </Button>
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={2} direction="row">
        <Link href={`mailto:${organizationInfo.data.email}`} sx={{ flex: 1 }}>
          {organizationInfo.data.email}
        </Link>
        <Stack spacing={1}>
          <Typography variant="body2">Id: {organizationInfo.data.id}</Typography>
        </Stack>
      </Stack>
      <TabContext value={searchParams.get('tab') || '0'}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={onTabChange}>
            <Tab label="Subscription" value="0" />
            <Tab label="Education Status" value="1" />
            <Tab label="Details" value="2" />
            <Tab
              label={
                <Badge badgeContent={organizationInfo.data.owners.length} color="primary" max={500}>
                  Owners
                </Badge>
              }
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="0">
          <Subscription organizationInfo={organizationInfo.data} />
        </TabPanel>
        <TabPanel value="1">
          <EducationStatus />
        </TabPanel>
        <TabPanel value="2">
          <Details />
        </TabPanel>
        <TabPanel value="3">
          <Owners owners={organizationInfo.data.owners} />
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

export default OrganizationDetails;
