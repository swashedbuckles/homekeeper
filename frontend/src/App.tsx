import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';

import { Root } from './components/Root';
import { AuthProvider } from './context/AuthProvider';
import { HouseholdProvider } from './context/HouseholdProvider';
import { AuthStatus } from './lib/types/authStatus';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';

import { Home } from './pages/Home';
import { KitchenSink } from './pages/KitchenSink';
import { LandingPage } from './pages/Landing';
import { CreateHousehold } from './pages/onboarding/Create';
import { OnboardingHome } from './pages/onboarding/Home';
import { InviteOthers } from './pages/onboarding/Invite';
import { JoinHousehold } from './pages/onboarding/Join';
import { OnboardingSuccess } from './pages/onboarding/Success';

/** @todo setup constants file for front-end */
const FIVE_MINUTES = 5 * 60 * 1000;
const QUERY_RETRIES = 1;

export function App() {
  const initialAuthState = {
    authStatus: AuthStatus.CHECKING,
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
        <HouseholdProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Root />}>
                <Route index element={<LandingPage />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              <Route path="/debug" element={<Root />}>
                <Route path="home" element={<Home />} />
                <Route path="kitchen-sink" element={<KitchenSink />} />
              </Route>
              <Route path="/onboarding">
                <Route index element={<OnboardingHome />} />
                <Route path="create" element={<CreateHousehold />} />
                <Route path="join" element={<JoinHousehold />} />
                <Route path="invite" element={<InviteOthers />} />
                <Route path="success" element={<OnboardingSuccess />} />
              </Route>
              <Route path="/dashboard" element={<Root />}>
                <Route index element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </HouseholdProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}