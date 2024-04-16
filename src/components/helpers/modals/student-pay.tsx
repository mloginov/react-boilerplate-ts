import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { FormGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { PlanRecord } from '../../../api/organizations-manager';

interface StudentPayProps {
  open?: boolean;
  onClose?: (result?: string[]) => void;
  plans?: PlanRecord[];
  activePlans?: string[];
}

const StudentPay = ({ onClose, open = false, plans, activePlans }: StudentPayProps) => {
  const onCancel = () => {
    onClose && onClose();
  };
  const getPlans = () => {
    const checkboxes =
      plans?.map((item) => {
        return (
          <FormControlLabel
            key={`checkbox_${item.id}`}
            control={<Checkbox defaultChecked={activePlans?.includes(item.id)} value={item.id} name={item.id} />}
            label={item.name}
          />
        );
      }) || null;
    return <FormGroup>{checkboxes}</FormGroup>;
  };
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onClose && onClose([...(formData as any).values()]);
        },
      }}
    >
      <DialogTitle>Student pay plans</DialogTitle>
      <DialogContent>
        <DialogContentText>Choose allowed student paid plans</DialogContentText>
        {getPlans()}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentPay;
