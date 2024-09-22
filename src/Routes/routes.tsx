import {NavigationContainer} from '@react-navigation/native';

import TabNavigation from './Tabs';

export default function Routes() {
  return (
    <NavigationContainer>
      <TabNavigation />
    </NavigationContainer>
  );
}
