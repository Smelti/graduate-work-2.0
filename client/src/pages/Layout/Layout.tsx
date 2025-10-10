import Header from './Header/Header';
import Menu from './Menu/Menu';
import Support from './Support/Support';

import './Layout.css';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className="layout">
        <Header />
        <div className="content">
          <Menu />
          <main>{children}</main>
        </div>
        <Support />
      </div>
    </>
  );
}
