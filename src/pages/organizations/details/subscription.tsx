import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { Organization } from '../../../api/organizations-manager';
import Confirm from '../../../components/helpers/modals/confirm';
import OrgLimits, { OrgLimitData } from '../../../components/helpers/modals/org-limits';

interface SubscriptionProps {
  organizationInfo: Organization;
}

interface ModalState<Type> {
  open: boolean;
  onClose: ((result?: Type) => void) | undefined;
}

const styles = {
  dataContainer: {
    flex: 1,
    maxWidth: 500,
  },
  labelStyle: {
    width: 100,
    fontWeight: 600,
    textAlign: 'end',
  },
};

const Subscription = ({ organizationInfo }: SubscriptionProps) => {
  const [confirmModal, setConfirmModal] = React.useState<ModalState<boolean> | null>(null);
  const [orgLimitsModal, setOrgLimitsModal] = React.useState<ModalState<OrgLimitData> | null>(null);

  if (!organizationInfo.subscription) {
    return <Alert severity="warning">No subscription</Alert>;
  }

  const onUpgradePlan = (planId: string) => {
    console.log('onUpgradePlan', planId);
    const onClose = (result?: boolean) => {
      setConfirmModal(null);
      if (result) {
        // todo upgrade subscription
      }
    };
    setConfirmModal({ open: true, onClose: onClose });
  };

  const onChangeOrgLimits = () => {
    const onClose = (result?: OrgLimitData) => {
      console.log('onChangeOrgLimits close', result);
      setOrgLimitsModal(null);
      if (result) {
        // todo upgrade limits
      }
    };
    setOrgLimitsModal({ open: true, onClose: onClose });
  };

  const onChangeTrialExpire = () => {
    // organizationInfo.subscription.trialExpire
  };

  const onChangeStartDate = () => {};

  return (
    <>
      <Stack spacing={2} direction="row">
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              Plan:
            </Typography>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography variant="body2">{organizationInfo.subscription.planId}</Typography>
              <Typography variant="body2">
                {organizationInfo.subscription.maxUsers} max users
                <Button size="small" onClick={() => onChangeOrgLimits()}>
                  Edit
                </Button>
              </Typography>
              <Button size="small" variant="contained" onClick={() => onUpgradePlan('eduPaid')}>
                Upgrade to Educational paid plan
              </Button>
              <Button size="small" variant="contained" onClick={() => onUpgradePlan('eduNonProfit')}>
                Upgrade to Educational Non Profit paid plan
              </Button>
              <Button size="small" variant="contained" onClick={() => onUpgradePlan('eduInternal')}>
                Upgrade to Educational Internal paid plan
              </Button>
              <Button size="small" variant="contained" onClick={() => onUpgradePlan('taPlan')}>
                Upgrade to Teacher Association plan
              </Button>
            </Stack>
          </Stack>
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              State:
            </Typography>
            <Typography variant="body2">{organizationInfo.subscription.state}</Typography>
          </Stack>
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              Trial ends:
            </Typography>
            <Typography variant="body2">
              {organizationInfo.subscription.trialExpire.toDateString()}
              <Button size="small" onClick={() => onChangeTrialExpire()}>
                Edit date
              </Button>
            </Typography>
          </Stack>
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              Licence start:
            </Typography>
            <Typography variant="body2">
              {organizationInfo.subscription.startDate?.toDateString() || 'None'}
              <Button size="small" onClick={() => onChangeStartDate()}>
                Edit date
              </Button>
            </Typography>
          </Stack>
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              Giga boxes:
            </Typography>
            <Typography variant="body2">Only available for paid education organizations.</Typography>
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h6" component="h6">
            Cancel this Subscription?
          </Typography>
          <Button color="error" variant="contained">
            Cancel Subscription
          </Button>
        </Stack>
      </Stack>
      <Confirm open={confirmModal?.open || false} onClose={confirmModal?.onClose} />
      <OrgLimits
        open={orgLimitsModal?.open || false}
        onClose={orgLimitsModal?.onClose}
        maxUsers={organizationInfo.subscription.maxUsers}
      />
    </>
  );
};

export default Subscription;
