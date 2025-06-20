import { BrowserRouter, Route, Routes } from 'react-router';

import { Root } from './components/Root';
import { AuthProvider } from './context/AuthProvider';
import { AuthStatus } from './lib/types/authStatus';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';

import { CreateHousehold } from './pages/onboarding/Create';
import { OnboardingHome } from './pages/onboarding/Home';
import { InviteOthers } from './pages/onboarding/Invite';
import { JoinHousehold } from './pages/onboarding/Join';
import { OnboardingSuccess } from './pages/onboarding/Success';

export function App() {
  const initialAuthState = {
    authStatus: AuthStatus.CHECKING,
    user: null,
  };

  return (
    <AuthProvider initialState={initialAuthState}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/onboarding">
            <Route index element={<OnboardingHome />}/>
            <Route path="create" element={<CreateHousehold />}/>
            <Route path="join" element={<JoinHousehold />}/>
            <Route path="invite" element={<InviteOthers />}/>
            <Route path="success" element={<OnboardingSuccess />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}