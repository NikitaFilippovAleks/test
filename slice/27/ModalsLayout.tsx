import React, { ReactElement } from 'react';

import { IconClose } from 'client/components/svg/navigation';

interface InterfaceProps {
  children: ReactElement | ReactElement[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Modal layout component
const ModalLayout = ({ children, isOpen, onClose, title }: InterfaceProps): ReactElement => {
  const renderContent = () => (
    <div className={`modalLayout ${!isOpen && 'd_none'}`}>
      <div className='modalLayout__modal'>
        <div className='d_flex justify_content_between align_items_center mb_4'>
          <h3 className='text_medium'>{title}</h3>

          <button className='modalLayout__modal__closeButton' type='button' onClick={onClose}>
            <img src={IconClose} alt='IconClose' />
          </button>
        </div>

        {children}
      </div>
    </div>
  );

  return renderContent();
};

export default ModalLayout;
