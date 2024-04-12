import React from 'react';
import { AccountDetails } from '../../../api/accounts-manager';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { ListItem } from '@mui/material';

interface IPsProps {
  accountInfo: AccountDetails;
}

const IPs = ({ accountInfo }: IPsProps) => {
  return (
    <List dense={true}>
      {accountInfo.ips.map((ip, index) => {
        return (
          <ListItem key={`${ip}_${index}`} divider={true}>
            <ListItemText primary={ip} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default IPs;
