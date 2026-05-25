import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { store } from './src/store';

export default function App() {
  const scheme = useColorScheme();
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </Provider>
  );
}
