import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface ConfirmProps {
  open: boolean;
  onClose: ((result: boolean) => void) | undefined;
  title?: string;
  content?: string;
  yesText?: string;
  noText?: string;
}

const Confirm = ({ onClose, open, content, yesText = 'Yes', title = 'Are you sure?', noText = 'No' }: ConfirmProps) => {
  const closeHandler = (result: boolean) => {
    onClose && onClose(result);
  };
  return (
    <Dialog open={open} onClose={() => closeHandler(false)}>
      <DialogTitle>{title}</DialogTitle>
      {content ? (
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button onClick={() => closeHandler(false)}>{noText}</Button>
        <Button onClick={() => closeHandler(true)} autoFocus>
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
