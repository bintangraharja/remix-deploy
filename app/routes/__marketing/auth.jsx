import authStyles from '~/styles/auth.css';
import AuthForm from '~/components/auth/AuthForm';
import { validateCredentials } from '~/data/validation.server';
import { login, signup } from '~/data/auth.server';
import { redirect } from '@remix-run/node';

export default function AuthPage() {
  return (
    <AuthForm/>

  )
}

export async function action({request}){
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get('mode') || 'login';

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try{
    validateCredentials(credentials);
  } catch (error){
    return error;
  }

  try {
    if (authMode === 'login') {
      return await login(credentials);
    } else {
      return await signup(credentials);
      // console.log(credentials);
      // return redirect('/expenses');
    }
  } catch (error) {
    return { credentials: error.message };
  }
}

export function links(){
    return[{rel: 'stylesheet', href: authStyles}];
}

export function headers({
  actionHeaders,
  loaderHeaders,
  parentHeaders
}){
  return {
    'Cache-Control': parentHeaders.get('Cache-Control'), //60 minutes
  }
}