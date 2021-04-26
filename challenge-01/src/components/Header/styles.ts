import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface ContainerProps {
  size?: 'small' | 'large';
}

interface LinkPageProps {
  'data-visited': boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header {
    max-width: 1120px;
    width: 100%;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const LinkPage = styled(Link)<LinkPageProps>`
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.2s;

  border-bottom: ${props => (props['data-visited'] ? '2px solid #ff872c' : 0)};
  padding-bottom: 10px;

  & + a {
    margin-left: 32px;
  }

  &:hover {
    opacity: 0.6;
  }
`;
