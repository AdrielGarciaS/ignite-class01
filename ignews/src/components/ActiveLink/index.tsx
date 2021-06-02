import { cloneElement, ReactElement } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export const ActiveLink = (props: ActiveLinkProps) => {
  const { children, activeClassName, href, ...rest } = props;

  const { asPath } = useRouter();

  const className = asPath === href ? activeClassName : '';

  return (
    <Link href={href} {...rest}>
      {cloneElement(children, { className })}
    </Link>
  );
};
