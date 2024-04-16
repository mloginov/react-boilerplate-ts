import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { Organization, PlanRecord, selfPayPlans } from '../../../api/organizations-manager';
import Confirm from '../../../components/helpers/modals/confirm';
import OrgLimits, { OrgLimitData } from '../../../components/helpers/modals/org-limits';
import DateSetup, { DateSetupItem } from '../../../components/helpers/modals/date-setup';
import StudentPay from '../../../components/helpers/modals/student-pay';

interface SubscriptionProps {
  organizationInfo: Organization;
}

interface ModalState<Type> {
  open: boolean;
  onClose: ((result?: Type) => void) | undefined;
}

interface DatesModalState extends ModalState<Record<string, Date>> {
  title: string;
  description?: string;
  dates: DateSetupItem[];
}

interface SelfPayModalState extends ModalState<string[]> {
  plans?: PlanRecord[];
  activePlans?: string[];
}

const styles = {
  dataContainer: {
    flex: 1,
    maxWidth: 600,
  },
  labelStyle: {
    width: 200,
    fontWeight: 600,
    textAlign: 'end',
  },
};

const Subscription = ({ organizationInfo }: SubscriptionProps) => {
  const [confirmModal, setConfirmModal] = React.useState<ModalState<boolean> | null>(null);
  const [orgLimitsModal, setOrgLimitsModal] = React.useState<ModalState<OrgLimitData> | null>(null);
  const [dateSetupModal, setDateSetupModal] = React.useState<DatesModalState | null>(null);
  const [studentPayModal, setStudentPayModal] = React.useState<SelfPayModalState | null>(null);
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
    const onClose = (result?: Record<string, Date>) => {
      console.log('onChangeTrialExpire result', result);
      // todo update trial end
      setDateSetupModal(null);
    };
    setDateSetupModal({
      open: true,
      title: 'Set trial expire',
      onClose: onClose,
      dates: [
        {
          name: 'trialEnd',
          title: 'Trial expire date',
          defaultValue: organizationInfo.subscription?.trialExpire,
          minDate: new Date(),
        },
      ],
    });
  };

  const onChangeStartDate = () => {
    const onClose = (result?: Record<string, Date>) => {
      console.log('onChangeStartDate result', result);
      // todo update licence start
      setDateSetupModal(null);
    };
    setDateSetupModal({
      open: true,
      title: 'Set licence start',
      onClose: onClose,
      dates: [
        { name: 'startDate', title: 'Licence start date', defaultValue: organizationInfo.subscription?.startDate },
      ],
    });
  };

  const onChangeStudentPay = () => {
    const onClose = (result?: string[]) => {
      console.log('onChangeStudentPay close', result);
      setStudentPayModal(null);
      if (result) {
        // todo student pay plans
      }
    };
    setStudentPayModal({
      open: true,
      onClose: onClose,
      activePlans: organizationInfo.subscription?.selfPayPlans,
      plans: selfPayPlans,
    });
  };

  // todo update vm/bp/books visibility
  const onChangeVM = () => {};
  const onChangeBehavioralPlagiarism = () => {};
  const onChangeBooks = () => {};

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
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              Student pay:
            </Typography>
            <Typography variant="body2">
              <Button size="small" onClick={() => onChangeStudentPay()}>
                {organizationInfo.subscription.isSelfPay ? 'Disable...' : 'Enable...'}
              </Button>
            </Typography>
          </Stack>
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              Virtual machines:
            </Typography>
            <Typography variant="body2">
              <Button size="small" onClick={() => onChangeVM()}>
                {organizationInfo.details.vm ? 'Disable...' : 'Enable...'}
              </Button>
            </Typography>
          </Stack>
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              Show behavioral plagiarism:
            </Typography>
            <Typography variant="body2">
              <Button size="small" onClick={() => onChangeBehavioralPlagiarism()}>
                {organizationInfo.details.showBehaviourPlagiarism ? 'Disable...' : 'Enable...'}
              </Button>
            </Typography>
          </Stack>
          <Stack spacing={1} direction="row" sx={styles.dataContainer}>
            <Typography variant="body2" sx={styles.labelStyle}>
              Show books:
            </Typography>
            <Typography variant="body2">
              <Button size="small" onClick={() => onChangeBooks()}>
                {organizationInfo.details.showBooks ? 'Disable...' : 'Enable...'}
              </Button>
            </Typography>
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
      <Confirm open={confirmModal?.open} onClose={confirmModal?.onClose} />
      <OrgLimits
        open={orgLimitsModal?.open}
        onClose={orgLimitsModal?.onClose}
        maxUsers={organizationInfo.subscription.maxUsers}
      />
      <DateSetup
        open={dateSetupModal?.open}
        onClose={dateSetupModal?.onClose}
        title={dateSetupModal?.title}
        description={dateSetupModal?.description}
        dates={dateSetupModal?.dates}
      />
      <StudentPay
        open={studentPayModal?.open}
        onClose={studentPayModal?.onClose}
        plans={studentPayModal?.plans}
        activePlans={studentPayModal?.activePlans}
      />
    </>
  );
};

export default Subscription;
