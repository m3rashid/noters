import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon';

import Button from './lib/button';
import Loader from './lib/loader';
import apiClient from '../api/client';
import TextInput from './lib/textInput';
import { useAuth } from '../hooks/auth';
import { useNavigate } from '@tanstack/react-router';

type LoginBody = { email: string; password: string };
type RegisterBody = LoginBody & { name: string };
type Errors = RegisterBody;

export type LoginWithCredentialsProps = {
  type: 'login' | 'register';
  onSuccess?: () => void;
  onFailure?: () => void;
};

function CredentialsLogin(props: LoginWithCredentialsProps) {
  const { setAuth } = useAuth();
	const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({ email: '', password: '', name: '' });
  const { isPending: isLoginPending, mutate: handleLogin } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (body: LoginBody) =>
      apiClient('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  });

  const { isPending: isRegisterPending, mutate: handleRegister } = useMutation({
    mutationKey: ['register'],
    mutationFn: async (body: RegisterBody) =>
      apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  });

  function onSuccess(data: any) {
    localStorage.setItem('token', data.token);
    setAuth({ isAuthenticated: true, user: data.user });
		navigate({to: "/"})
    if (props.onSuccess) props.onSuccess();
  }

  function onError() {
    if (props.onFailure) props.onFailure();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    ) as any;
    if (props.type === 'login') {
      handleLogin(
        { email: formData.email, password: formData.password },
        { onError, onSuccess }
      );
    } else {
      handleRegister(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { onError, onSuccess }
      );
    }
  }

  return (
    <form className='flex w-full flex-col gap-4' onSubmit={handleSubmit}>
      {props.type === 'register' ? (
        <TextInput
          name='name'
          type='name'
          label='Name'
          placeholder='Noters Hero'
          required
          errorText={errors.name}
        />
      ) : null}

      <TextInput
        name='email'
        type='email'
        label='Email'
        placeholder='rashid@noters.com'
        required
        descriptionText='We will never share your email.'
        errorText={errors.email}
      />

      <TextInput
        placeholder='Shhh...'
        required
        name='password'
        type='password'
        label='Password'
        errorText={errors.password}
      />

      <Button
        type='submit'
        className='mt-2'
        leftIcon={LockClosedIcon}
        label={props.type === 'register' ? 'Register' : 'Login'}
        {...(isLoginPending || isRegisterPending ? { rightIcon: Loader } : {})}
      />
    </form>
  );
}

export default CredentialsLogin;
