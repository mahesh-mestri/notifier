import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import StoreProvider from './src/providers/StoreProvider';
import RootNavigator from './src/navigation/RootNavigator';
import NavigationProvider from './src/providers/NavigationProvider';

function App() {

  const isdarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle={isdarkMode ? 'light-content' : 'dark-content'} />
        <StoreProvider>
          <NavigationProvider>
            <RootNavigator />
          </NavigationProvider>
        </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default App;
