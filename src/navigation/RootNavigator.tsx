import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { PrescriptionReviewScreen } from '../screens/PrescriptionReviewScreen';
import { SessionStatusScreen } from '../screens/SessionStatusScreen';
import { StartScreen } from '../screens/StartScreen';
import { darkPalette, lightPalette } from '../theme/colors';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const palette = isDark ? darkPalette : lightPalette;

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: palette.background,
      card: palette.background,
      text: palette.text,
      border: palette.border,
      primary: palette.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.background },
          headerTitleStyle: { color: palette.text },
          headerTintColor: palette.primary,
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SessionStatus"
          component={SessionStatusScreen}
          options={{ title: 'Prescription session', headerBackVisible: false }}
        />
        <Stack.Screen
          name="Review"
          component={PrescriptionReviewScreen}
          options={{ title: 'Review' }}
        />
        <Stack.Screen
          name="Confirmation"
          component={OrderConfirmationScreen}
          options={{ title: 'Confirmation', headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
