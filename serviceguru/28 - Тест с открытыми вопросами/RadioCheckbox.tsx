import React, { ReactElement } from 'react';

import { Box, Pressable, Icon, Input, Text, Row } from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TickIcon from 'svg/Tick';
import CrossIcon from 'svg/Cross';
import reactotron from 'reactotron-react-native';

// Обертка чекбокса
const RadioCheckbox = ({
  checked,
  setChecked,
  label,
  type = 'checkbox',
  correctCheckbox = true,
  borderColor = '#55BAF9',
  innerElementColor = '#EFA350',
  labelColor = '#333333'
}): ReactElement => {
  // reactotron.log('Checked:', checked);
  let renderInnerElement;
  if (type === 'radio') renderInnerElement = <Box w={3} h={3} borderRadius='full' bgColor={innerElementColor} />;
  else if (correctCheckbox) renderInnerElement = <TickIcon color={innerElementColor} width={14} height={14} />;
  else renderInnerElement = <CrossIcon color={innerElementColor} />;

  return (
    <Pressable onPress={() => setChecked(!checked)}>
      <Row alignItems='center'>
        <Box h={5}
             w={5}
             borderWidth={2}
             borderColor={borderColor}
             borderRadius={type === 'checkbox' ? 2 : 'full'}
             justifyContent='center'
             alignItems='center'>
          {checked && renderInnerElement}
        </Box>
        {typeof label === 'string' ? (
          <Text fontSize='sm' pl={2} color={labelColor}>
            {label}
          </Text>
        ) : (
          label
        )}
      </Row>
    </Pressable>
  );
};

export default RadioCheckbox;
