import { register } from "../../lib/api/auth";
import { useNavigate } from "react-router";
export function Register() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const res = await register('tom@tomseph.dev', 'abcDEFG123!@#$', 'tom');
    console.log('res!!', res);

    navigate('/');
  };

  return (
    <>
      <div>
        <p>Register Page</p>
        <br/>
        <button onClick={handleClick}>Register</button>
      </div>
    </>
  )
}