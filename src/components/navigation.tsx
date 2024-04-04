import React, { useContext, useState } from 'react';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import Badge from '@mui/material/Badge';

import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import Lightbulb from '@mui/icons-material/Lightbulb';

import { AuthContext } from './auth/auth-context';
import {useAllRequests} from "../features/requests";

interface IRequestsMap {
  [key: string]: number;
}

const educationItems: (IMenuItem | IMenuDivider | IMenuSubheader)[] = [
  {
    title: 'University',
    requestsKey: 'university',
    to: '/education/requests/university',
    styleName: 'nested',
  },
  {
    title: 'Bootcamps',
    requestsKey: 'bootcamps',
    to: '/education/requests/bootcamps',
    styleName: 'nested',
  },
  {
    title: 'Professional training',
    requestsKey: 'profTraining',
    to: '/education/requests/prof-training',
    styleName: 'nested',
  },
  {
    title: 'K12',
    requestsKey: 'k12',
    to: '/education/requests/k12',
    styleName: 'nested',
  },
  {
    title: 'Enterprise',
    requestsKey: 'enterprise',
    to: '/education/requests/enterprise',
    styleName: 'nested',
  },
];

interface IMenuItem {
  title: string,
  to?: string,
  icon?: string | React.JSX.Element | React.JSX.Element[],
  group?: boolean,
  requestsKey?: string,
  styleName?: string
  items?: (IMenuItem | IMenuDivider | IMenuSubheader)[]
}
interface IMenuDivider {
  divider: boolean,
  styleName?: string
}
const isMenuDivider = (item: IMenuItem | IMenuDivider | IMenuSubheader) => {
  return (item as IMenuDivider).divider !== undefined
}
interface IMenuSubheader {
  subheader: string,
  styleName?: string
}
const isMenuSubheader = (item: IMenuItem | IMenuDivider | IMenuSubheader) => {
  return (item as IMenuSubheader).subheader !== undefined
}

const menuItems: (IMenuItem | IMenuDivider | IMenuSubheader)[] = [
  { title: 'Accounts', to: '/accounts', icon: <PeopleIcon /> },
  { title: 'Organizations', to: '/organizations', icon: <BusinessIcon /> },
  { divider: true },
  { subheader: 'Education' },
  {
    title: 'Trial requests',
    requestsKey: 'total',
    icon: <Lightbulb />,
    group: true,
    items: educationItems,
  },
  {
    title: 'Generate activation codes',
    to: '/education/generate-activation-codes',
    icon: <MonetizationOn />,
  },
  {
    title: 'Check activation code',
    to: '/education/check-activation-code',
    icon: <MonetizationOn />,
  },
];

const drawerWidth = 280;

type IStylesMap = {
  [key: string]: any;
};

const Navigation = () => {
  const { isAuth, login } = useContext(AuthContext);
  const theme = useTheme()
  const navigate = useNavigate();
  const [openRequests, setOpenRequests] = useState(true);

  const styles: IStylesMap = {
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    nested: {
      paddingLeft: theme.spacing(9),
    },
    collapseIconWithBadge: {
      marginLeft: 6,
    },
    badge: {
      '& .MuiBadge-badge': {
        right: -16,
        top: 15,
        padding: '0 4px',
      }
    },
  };

  let menu = (
    <ListItemButton onClick={login}>
      <ListItemIcon>
        <VpnKeyIcon />
      </ListItemIcon>
      <ListItemText primary="Login" />
    </ListItemButton>
  )
  const requests = useAllRequests({enabled: isAuth})
  let requestsCountMap: IRequestsMap | null = null

  if (requests.data) {
    const requestsByType = _.groupBy(requests.data, 'type');
    requestsCountMap = _.mapValues(
      requestsByType,
      (values) => values.length
    );
    requestsCountMap.total = requests.data.length;
  }

  const renderMenuItems = (items: (IMenuItem | IMenuDivider | IMenuSubheader)[], parentKey = '') => {
    const elements = items.map((item, index) => {
      const key = `${parentKey}-${index}`;
      if (isMenuDivider(item)) {
        const divider = item as IMenuDivider
        return <Divider key={key} sx={divider.styleName ? styles[divider.styleName] : undefined} />;
      }
      if (isMenuSubheader(item)) {
        const subheader = item as IMenuSubheader
        return (
          <ListSubheader
            key={key}
            inset
            disableSticky
            sx={subheader.styleName ? styles[subheader.styleName] : undefined}
          >
            {subheader.subheader}
          </ListSubheader>
        );
      }
      const menuItem = item as IMenuItem
      const icon = menuItem.icon ? <ListItemIcon>{menuItem.icon}</ListItemIcon> : null;
      const itemText = <ListItemText primary={menuItem.title} />;
      let listTextEl = itemText;
      if (menuItem.requestsKey) {
        listTextEl = (
          <Badge
            badgeContent={requestsCountMap ? requestsCountMap[menuItem.requestsKey] : ''}
            invisible={!requestsCountMap || !requestsCountMap[menuItem.requestsKey]}
            color="primary"
            sx={styles.badge}
          >
            {itemText}
          </Badge>
        );
      }
      if (menuItem.group) {
        const collapseIconStyle = menuItem.requestsKey
          ? styles.collapseIconWithBadge
          : undefined;
        return (
          <React.Fragment key={key}>
            <ListItemButton
              onClick={() => setOpenRequests(!openRequests)}
              sx={menuItem.styleName ? styles[menuItem.styleName] : undefined}
            >
              {icon}
              {listTextEl}
              {openRequests ? (
                <ExpandLess sx={collapseIconStyle} />
              ) : (
                <ExpandMore sx={collapseIconStyle} />
              )}
            </ListItemButton>
            <Collapse in={openRequests} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {menuItem.items ? renderMenuItems(menuItem.items, key) : null}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }
      return (
        <ListItemButton
          key={key}
          onClick={menuItem.to ? () => navigate(menuItem.to as string) : undefined}
          sx={menuItem.styleName ? styles[menuItem.styleName] : undefined}
        >
          {icon}
          {listTextEl}
        </ListItemButton>
      );
    });
    return <>{elements}</>;
  };

  if (isAuth) {
    menu = renderMenuItems(menuItems)
  }

  return (
    <Drawer
      variant="permanent"
      sx={styles.drawer}
      PaperProps={{sx: styles.drawerPaper}}
      anchor="left"
    >
      <List>
        <div>
          {menu}
        </div>
      </List>
    </Drawer>
  );
};

export default Navigation;
