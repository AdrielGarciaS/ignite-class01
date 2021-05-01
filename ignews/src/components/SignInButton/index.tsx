import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export const SignInButton = () => {
  const isUserLoggedIn = true;

  if (isUserLoggedIn) {
    return (
      <button className={styles.signInButton} type="button">
        <FaGithub color="#04d361" />
        Adriel Garcia
        <FiX color="#737380" className={styles.closeIcon} />
      </button>
    );
  }

  return (
    <button className={styles.signInButton} type="button">
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
};
