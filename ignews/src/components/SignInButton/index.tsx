import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client';

import styles from './styles.module.scss';

export const SignInButton = () => {
  const [session] = useSession();

  if (session) {
    return (
      <button
        className={styles.signInButton}
        type="button"
        onClick={() => signOut()}
      >
        <FaGithub color="#04d361" />
        {session.user.name}
        <FiX color="#737380" className={styles.closeIcon} />
      </button>
    );
  }

  return (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
};
