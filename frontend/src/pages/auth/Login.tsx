import { login } from "../../lib/api/auth";
import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const res = await login('tom@tomseph.dev', 'abc123');
    console.log('res!', res);
    navigate('/');
  };

  return (
    <>
      <div>
        <p>Login Page</p>
        <br/>
        <button onClick={handleClick}>LOGIN</button>
      </div>
    </>
  )
}