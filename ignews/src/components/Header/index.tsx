import { SignInButton } from 'components/SignInButton';

import styles from './styles.module.scss';

export const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />

        <nav>
          <a className={styles.active} href="#test">
            Home
          </a>
          <a href="#test">Posts</a>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
};
