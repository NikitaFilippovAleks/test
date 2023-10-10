import React, { ReactElement } from 'react';

import MainButton from 'client/components/helpers/MainButton';
import ModalLayout from 'client/components/helpers/ModalLayout';

interface InterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

// Split bill modal component
const ModalsSplitBill = ({ isOpen, onClose }: InterfaceProps): ReactElement => {
  const renderContent = () => (
    <ModalLayout title='Split the bill' isOpen={isOpen} onClose={onClose}>
      <div className='d_flex direction_column'>
        <MainButton text='pay for you items' styleClass='mb_2' filled onClick={() => {}} />

        <MainButton text='divide the bill equally' styleClass='mb_2' filled onClick={() => {}} />

        <MainButton text='custom amount' filled onClick={() => {}} />
      </div>
    </ModalLayout>
  );

  return renderContent();
};

export default ModalsSplitBill;
