import React, { ReactElement } from 'react';

interface InterfaceProps {
  children: ReactElement | ReactElement[];
  modalTitle?: string;
}

// Layout component
const Layout = ({ children }: InterfaceProps): ReactElement => {
  const renderContent = () => (
    <div className='position_relative full_size d_flex direction_column h_100'>
      {children}
    </div>
  );

  return renderContent();
};

export default Layout;
