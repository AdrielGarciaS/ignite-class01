import { SignInButton } from 'components/SignInButton';

import { Pages } from 'utils/paths';
import { ActiveLink } from 'components/ActiveLink';
import styles from './styles.module.scss';

export const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />

        <nav>
          <ActiveLink href={Pages.HOME} activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>

          <ActiveLink
            href={Pages.POSTS}
            activeClassName={styles.active}
            prefetch
          >
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
};
