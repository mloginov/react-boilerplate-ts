import React from 'react';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import TabPanel from '@mui/lab/TabPanel';

import { Request, RequestState } from '../../api/requests-manager';
import RequestsGrid from './grid';

interface RequestsTabsProps {
  requests: Request[];
  tab: string;
  onTabChange: (tab: string) => void;
}

const RequestsTabs = ({ requests, tab, onTabChange }: RequestsTabsProps) => {
  const requestsCount = requests.filter((request) => request.state === RequestState.REQUEST).length || 0;

  const getRequestsGrid = (state: RequestState) => {
    const data = requests.filter((request) => request.state === state);
    const showActionsColumn = state === RequestState.MORE_INFO || state === RequestState.DENIED;
    const showDemoColumn = state === RequestState.APPROVED;
    return <RequestsGrid requests={data} showActionsColumn={showActionsColumn} showDemoColumn={showDemoColumn} />;
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
