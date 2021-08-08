import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react'
import { parseCookies } from 'nookies'

import { useAuth } from '../context/AuthContext';

import styles from '../styles/Home.module.css'
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();

  const handleSubmit = async(event: FormEvent) => {
    event.preventDefault();

    await signIn({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" onChange={event => setEmail(event.target.value)} />
      <input type="password" onChange={event => setPassword(event.target.value)} />

      <button type="submit">Entrar</button>
    </form>
  )
}

export const getServerSideProps = withSSRGuest(async (context) => {
  return {
    props: {},
  }
})