import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

const DOTS = 3;

export function LoadingDots() {
  const theme = useTheme();
  const values = useRef(Array.from({ length: DOTS }, () => new Animated.Value(0.3))).current;

  useEffect(() => {
    const animations = values.map((value, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(idx * 160),
          Animated.timing(value, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(value, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]),
      ),
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [values]);

  return (
    <View style={styles.container} accessibilityLabel="Loading">
      {values.map((value, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: theme.colors.primary, opacity: value },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
