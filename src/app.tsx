import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { RequestType } from './api/requests-manager';

import { AuthProvider } from './components/auth/auth-context';
import ProtectedRoute from './components/protected-route';
import Navigation from './components/navigation';

import Accounts from './pages/accounts';
import Landing from './pages/landing';
import AccountDetails from './pages/accounts/details';
import NotFound from './pages/not-found';
import Organizations from './pages/organizations';
import OrganizationDetails from './pages/organizations/details';
import Requests from './pages/education/requests';
import AuthenticationRequired from './pages/auth-required';
import RequestDetails from './pages/requests/details';

const theme = createTheme();
const queryClient = new QueryClient();

export class App extends React.Component {
  public render(): React.JSX.Element {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <div style={{ display: 'flex' }}>
              <CssBaseline />
              <AuthProvider>
                <Navigation />
                <main
                  style={{ flexGrow: 1, backgroundColor: theme.palette.background.default, padding: theme.spacing(3) }}
                >
                  <Routes>
                    <Route element={<ProtectedRoute />}>
                      <Route path="/accounts">
                        <Route path=":id" element={<AccountDetails />} />
                        <Route index element={<Accounts />} />
                        <Route path={'*'} element={<Navigate to="/not-found" replace />} />
                      </Route>
                      <Route path="/organizations">
                        <Route path=":id" element={<OrganizationDetails />} />
                        <Route index element={<Organizations />} />
                        <Route path={'*'} element={<Navigate to="/not-found" replace />} />
                      </Route>
                      <Route path="/education">
                        <Route path="requests">
                          <Route path="university">
                            <Route index element={<Requests type={RequestType.UNIVERSITY} />} />
                            <Route path=":id" element={<RequestDetails />} />
                          </Route>
                          <Route path="bootcamps" element={<Requests type={RequestType.BOOTCAMPS} />} />
                          <Route path="prof-training" element={<Requests type={RequestType.PROF_TRAINING} />} />
                          <Route path="k12" element={<Requests type={RequestType.K12} />} />
                          <Route path="enterprise" element={<Requests type={RequestType.ENTERPRISE} />} />
                        </Route>
                      </Route>
                    </Route>
                    <Route path="/login" element={<AuthenticationRequired />} />
                    <Route path="/" element={<Landing />} />
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path={'*'} element={<Navigate to="/not-found" replace />} />
                  </Routes>
                </main>
              </AuthProvider>
            </div>
          </ThemeProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    );
  }
}
