import React from 'react';
import { Alert, Snackbar, AlertColor } from '@mui/material';

interface AlertMessageProps {
  open: boolean;
  severity: AlertColor;
  message: string;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  open,
  severity,
  message,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;