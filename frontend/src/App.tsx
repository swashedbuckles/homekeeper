import { BrowserRouter, Route, Routes } from 'react-router';
import { Root } from './components/Root';
import { AuthProvider } from './context/AuthProvider';
import { AuthStatus } from './lib/types/authStatus';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Home } from './pages/Home';

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
            <Route index />
            <Route path="create" />
            <Route path="join" />
            <Route path="invite" />
          </Route>
          <Route path="/dashboard"/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}