import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface Props {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

export const Can = (props: Props) => {
  const { children, permissions = [], roles = [] } = props;

  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) return null;

  return (
    <>
      {children}
    </>
  )
}