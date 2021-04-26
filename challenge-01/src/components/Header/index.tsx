import React, { useMemo } from 'react';

import { useRouteMatch } from 'react-router-dom';

import { Container, LinkPage } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => {
  const { path } = useRouteMatch();

  const activeRoute = useMemo(() => path, [path]);

  return (
    <Container size={size}>
      <header>
        <img src={Logo} alt="GoFinances" />
        <nav>
          <LinkPage data-visited={activeRoute === '/'} to="/">
            Listagem
          </LinkPage>
          <LinkPage data-visited={activeRoute === '/import'} to="/import">
            Importar
          </LinkPage>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
