import React, { ReactElement } from 'react';

import { Center, Pressable, Text } from 'native-base';

interface PropsInterface {
  label: string, // Заголовок
  filter: string, // Тип фильтра
  isActive: boolean, // Активенн ли элемент полоски фильтров
  setActiveFilter: (filter: string) => void, // Установить активный элемент
}

// Элемент полоски фильтров
const FilterItem = ({ label, filter, isActive, setActiveFilter }: PropsInterface): ReactElement => {
  const renderContent = () => (
    <Pressable flex={1} onPress={() => setActiveFilter(filter)}>
      <Center bgColor={isActive ? 'primary' : 'light'}
              py={3}
              borderColor={isActive ? 'primary' : 'textSecondary'}
              borderWidth={1}>
        <Text fontSize='lg' color={isActive ? 'light' : 'textSecondary'}>
          {label}
        </Text>
      </Center>
    </Pressable>
  );

  return renderContent();
};

export default FilterItem;
