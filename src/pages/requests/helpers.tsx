import { RequestState } from '../../api/requests-manager';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import React from 'react';

export enum RequestAction {
  APPROVE,
  DENY,
  MOVE_TO_PENDING,
}

export const getActionButtonsByState = (state: RequestState, onAction: (action: RequestAction) => void) => {
  switch (state) {
    case RequestState.REQUEST:
    case RequestState.APPROVED:
      return null;
    case RequestState.MORE_INFO:
      return (
        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small" onClick={() => onAction(RequestAction.APPROVE)} color="success">
            Approve
          </Button>
          <Button variant="contained" size="small" onClick={() => onAction(RequestAction.DENY)} color="error">
            Deny
          </Button>
        </Stack>
      );
    case RequestState.DENIED:
      return (
        <Button variant="contained" size="small" onClick={() => onAction(RequestAction.MOVE_TO_PENDING)} color="info">
          Move to Pending
        </Button>
      );
  }
};
