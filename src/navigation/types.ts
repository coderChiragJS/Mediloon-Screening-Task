import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Start: undefined;
  SessionStatus: undefined;
  Review: undefined;
  Confirmation: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
