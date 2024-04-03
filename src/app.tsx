import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'

import { AuthProvider } from './components/auth/auth-context';
import ProtectedRoute from './components/protected-route';
import Navigation from './components/navigation';

import Accounts from './pages/accounts';
import Landing from './pages/landing';
import AuthenticationRequired from './pages/auth-required';

const theme = createTheme();
const queryClient = new QueryClient()

export class App extends React.Component {
  public render(): React.JSX.Element {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <div style={{display: 'flex'}}>
            <CssBaseline />
            <AuthProvider>
              <Navigation />
              <main style={{flexGrow: 1, backgroundColor: theme.palette.background.default, padding: theme.spacing(3)}}>
                <Routes>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/accounts" element={<Accounts />} />
                  </Route>
                  <Route path="/login" element={<AuthenticationRequired />} />
                  <Route path="/" element={<Landing />} />
                </Routes>
              </main>
            </AuthProvider>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }
}
