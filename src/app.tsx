import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './components/auth/auth-context';
import ProtectedRoute from './components/protected-route';
import Navigation from './components/navigation';

import Accounts from './pages/accounts';
import Landing from './pages/landing';
import AuthenticationRequired from './pages/auth-required';
import AccountDetails from './pages/accounts/details';
import NotFound from './pages/not-found';
import Organizations from './pages/organizations';
import OrganizationDetails from './pages/organizations/details';

const theme = createTheme();
const queryClient = new QueryClient();

export class App extends React.Component {
  public render(): React.JSX.Element {
    return (
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
    );
  }
}
