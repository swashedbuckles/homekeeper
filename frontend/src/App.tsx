import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthProvider } from './context/AuthProvider';
import { AuthStatus } from './lib/types/authStatus';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}