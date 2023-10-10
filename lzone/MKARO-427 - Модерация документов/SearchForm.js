import React from 'react';

import {Form, Icon, Input, Item } from 'native-base';

import themeVariables from '../../Theme/native-base-theme/variables/platform';

// Вывод формы поиска по введенному тексту
export default function SearchForm ({
  formStyle = {},
  inputStyle = {},
  searchBarStyle = {},
  iconStyle = {},
  placeholder,
  filterByText,
  setFilterByText,
  placeholderTextColor = themeVariables.brandLightGrey
}) {
  return (
    <Form style={formStyle}>
      <Item regular rounded iconLeft style={{marginBottom: 0, ...searchBarStyle}}>
        <Icon brandLG type="MaterialIcons" name="search" style={iconStyle} />
        <Input style={inputStyle}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              value={filterByText}
              onChangeText={(text) => setFilterByText(text)} onSubmitEditing={() => console.log(filterByText)} />
      </Item>
    </Form>
  );
}
