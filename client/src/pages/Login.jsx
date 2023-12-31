import styled from 'styled-components'
import { Link, Form, redirect, useActionData, useNavigate } from 'react-router-dom'
import { Logo, FormRow, SubmitBtn } from '../components'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'

// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const data = Object.fromEntries(formData);
//   const errors = { msg: '' };
//   if (data.password.length < 3) {
//     errors.msg = 'password too short';
//     return errors;
//   }
//   try {
//     await customFetch.post('/auth/login', data);
//     toast.success('Login successful');
//     return redirect('/dashboard');
//   } catch (error) {
//     // toast.error(error?.response?.data?.msg);
//     // return error;
//     //* Use useActionData()
//     errors.msg = error?.response?.data?.msg;
//     return errors;
//   }
// }

//* With React query
export const action = (queryClient) => async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const errors = { msg: '' };
  if (data.password.length < 3) {
    errors.msg = 'password too short';
    return errors;
  }
  try {
    await customFetch.post('/auth/login', data);
    queryClient.invalidateQueries();
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    // toast.error(error?.response?.data?.msg);
    // return error;
    //* Use useActionData()
    errors.msg = error?.response?.data?.msg;
    return errors;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const errors = useActionData();

  const loginDemoUser = async () => {
    const data = {
      email: 'test@test.com',
      password: 'secret123'
    };
    try {
      await customFetch.post('/auth/login', data);
      toast.success('Take a test drive');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  }

  return (
    <StyledFormWrapper2>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        {errors && <p style={{ color: 'red'}}>{errors.msg}</p>}
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />
        <SubmitBtn formBtn />
        <button type="button" className='btn btn-block' onClick={loginDemoUser}>
          explore the app
        </button>
        <p>
          Not a member yet?
          <Link to="/register" className='member-btn'>
            Register
          </Link>
        </p>
      </Form>
    </StyledFormWrapper2> 
  )
}

const StyledFormWrapper2 = styled.section`
  min-height: 100vh;
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }
  h4 {
    text-align: center;
    margin-bottom: 1.38rem;
  }
  p {
    margin-top: 1rem;
    text-align: center;
    line-height: 1.5;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    color: var(--primary-500);
    letter-spacing: var(--letter-spacing);
    margin-left: 0.25rem;
  }
`

export default Login