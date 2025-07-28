import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AuthRouteGuard } from './components/auth/AuthRouteGuard';
import { Root } from './components/Root';
import { AuthInitializer } from './context/AuthInitializer';
import { AuthProvider } from './context/AuthProvider';
import { HouseholdProvider } from './context/HouseholdProvider';
import { AuthStatus } from './lib/types/authStatus';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';

import { KitchenSink } from './pages/examples/KitchenSink';
import { LayoutExamples } from './pages/examples/LayoutExamples';
import { Home } from './pages/Home';
import { LandingPage } from './pages/Landing';
import { CreateHousehold } from './pages/onboarding/Create';
import { OnboardingHome } from './pages/onboarding/Home';
import { InviteOthers } from './pages/onboarding/Invite';
import { JoinHousehold } from './pages/onboarding/Join';
import { OnboardingSuccess } from './pages/onboarding/Success';
import { Settings } from './pages/Settings';

/** @todo setup constants file for front-end */
const FIVE_MINUTES = 5 * 60 * 1000;
const QUERY_RETRIES = 1;

export function App() {
  const initialAuthState = {
    authStatus: AuthStatus.UNKNOWN,
    user: null,
  };

  const queryClient = new QueryClient({
    defaultOptions: { /** @todo feels like this config should be elsewhere */
      queries: {
        staleTime: FIVE_MINUTES,
        retry: QUERY_RETRIES,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: QUERY_RETRIES,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialState={initialAuthState}>
        <AuthInitializer>
          <HouseholdProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Root />}>
                  <Route index element={<AuthRouteGuard publicRoute><LandingPage /></AuthRouteGuard>} />
                  <Route path="login" element={<AuthRouteGuard publicRoute><Login /></AuthRouteGuard>} />
                  <Route path="register" element={<AuthRouteGuard publicRoute><Register /></AuthRouteGuard>} />
                </Route>
                <Route path="/debug" element={<Root />}>
                  <Route path="home" element={<Home />} />
                  <Route path="kitchen-sink" element={<KitchenSink />} />
                  <Route path="layout" element={<LayoutExamples />} />
                </Route>
                <Route path="/onboarding">
                  <Route index element={<AuthRouteGuard requireAuth><OnboardingHome /></AuthRouteGuard>} />
                  <Route path="create" element={<AuthRouteGuard requireAuth><CreateHousehold /></AuthRouteGuard>} />
                  <Route path="join" element={<AuthRouteGuard requireAuth><JoinHousehold /></AuthRouteGuard>} />
                  <Route path="invite" element={<AuthRouteGuard requireAuth><InviteOthers /></AuthRouteGuard>} />
                  <Route path="success" element={<AuthRouteGuard requireAuth><OnboardingSuccess /></AuthRouteGuard>} />
                </Route>
                <Route path="/dashboard" element={<Root />}>
                  <Route index element={<AuthRouteGuard requireAuth><Dashboard /></AuthRouteGuard>} />
                </Route>
                <Route path="/settings" element={<Root />}>
                  <Route index element={<AuthRouteGuard requireAuth><Settings /></AuthRouteGuard>} />
                </Route>
              </Routes>
            </BrowserRouter>
          </HouseholdProvider>
        </AuthInitializer>
      </AuthProvider>
    </QueryClientProvider>
  );
}