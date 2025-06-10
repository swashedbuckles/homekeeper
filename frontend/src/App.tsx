import { BrowserRouter, Route, Routes } from 'react-router'
// import Logo from './assets/logo.svg';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

export function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Root/>}> 
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}


