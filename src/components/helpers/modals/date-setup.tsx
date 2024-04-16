import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';

export interface DateSetupItem {
  name: string;
  title: string;
  defaultValue?: Date;
  minDate?: Date;
  maxDate?: Date;
}

interface DateSetupProps {
  open?: boolean;
  onClose?: (result?: Record<string, Date>) => void;
  title?: string;
  description?: string;
  dates?: DateSetupItem[];
}

const DateSetup = ({ onClose, open = false, title, description, dates }: DateSetupProps) => {
  const onCancel = () => {
    onClose && onClose();
  };
  const getItemControls = (item: DateSetupItem, index: number) => {
    return (
      <DatePicker
        name={item.name}
        key={`date_${index}`}
        label={item.title}
        defaultValue={dayjs(item.defaultValue)}
        minDate={item.minDate ? dayjs(item.minDate) : undefined}
        maxDate={item.maxDate ? dayjs(item.maxDate) : undefined}
      />
    );
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
          const result: Record<string, Date> = {};
          for (const pair of formData.entries()) {
            result[pair[0] as string] = new Date(pair[1] as string);
          }
          onClose && onClose(result);
        },
      }}
    >
      <DialogTitle>{title || ''}</DialogTitle>
      <DialogContent>
        {description ? <DialogContentText>{description}</DialogContentText> : null}
        <Stack sx={{ marginTop: 2 }} spacing={2}>
          {dates?.map(getItemControls)}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateSetup;
