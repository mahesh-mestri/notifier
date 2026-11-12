import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import ThemeProvider from './src/providers/ThemeProvider';
import StoreProvider from './src/providers/StoreProvider';

function App() {

  return (
    <SafeAreaProvider style={styles.container}>
      <ThemeProvider>
        <StoreProvider>
          <View>
    
          </View>
        </StoreProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});

export default App;
