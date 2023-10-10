import { Box, Button, Icon, Input, Text } from 'native-base';

const renderSearchForm = () => (
  <Box display='flex' flexDirection='row' mb={6}>
    <Input placeholder='Поиск'
           borderRadius={31}
           backgroundColor='#F7F7F7'
           borderWidth={0}
           fontSize='xs'
           pl={2}
           mr={1}
           flex={1}
           InputLeftElement={<Icon as={<SearchIcon />} ml={3} w={20} h={20} />} />

    <Button w={90} borderRadius={29} backgroundColor='#55BAF9'>Найти</Button>
  </Box>
);