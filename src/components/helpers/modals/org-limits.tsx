import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export interface OrgLimitData {
  maxUsers: number;
}

interface OrgLimitsProps {
  open: boolean;
  onClose: ((result?: OrgLimitData) => void) | undefined;
  maxUsers: number;
}

const OrgLimits = ({ onClose, open, maxUsers }: OrgLimitsProps) => {
  const [validationError, setValidationError] = React.useState<Record<string, string | null>>({});
  const onCancel = () => {
    onClose && onClose();
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name !== 'maxUsers') {
      return;
    }
    if (isNaN(Number(event.target.value))) {
      setValidationError({ maxUsers: 'Please enter a valid number' });
    } else {
      setValidationError({ maxUsers: null });
    }
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
          const formJson = Object.fromEntries((formData as any).entries());
          formJson.maxUsers = parseInt(formJson.maxUsers, 10);
          onClose && onClose(formJson as OrgLimitData);
        },
      }}
    >
      <DialogTitle>Organization Limits</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter organization limits in the following fields</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          name="maxUsers"
          label="User Limit"
          fullWidth
          variant="standard"
          error={!!validationError['maxUsers']}
          helperText={validationError['maxUsers']}
          onChange={onChange}
          defaultValue={maxUsers}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button type="submit" disabled={!!validationError['maxUsers']}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrgLimits;
