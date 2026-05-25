import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

export type StepState = 'pending' | 'active' | 'complete' | 'failed';

interface Props {
  title: string;
  state: StepState;
  isLast?: boolean;
}

export function StatusStep({ title, state, isLast = false }: Props) {
  const theme = useTheme();

  const indicator = (() => {
    if (state === 'active') {
      return (
        <ActivityIndicator
          color={theme.colors.primary}
          accessibilityLabel="In progress"
        />
      );
    }
    const bg = (() => {
      if (state === 'complete') return theme.colors.success;
      if (state === 'failed') return theme.colors.danger;
      return theme.colors.border;
    })();
    const symbol = state === 'failed' ? '!' : state === 'complete' ? '✓' : '';
    return (
      <View
        style={[
          styles.circle,
          { backgroundColor: bg, borderColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.circleText, { color: theme.colors.textInverse }]}>{symbol}</Text>
      </View>
    );
  })();

  const titleColor = (() => {
    if (state === 'failed') return theme.colors.danger;
    if (state === 'pending') return theme.colors.textMuted;
    return theme.colors.text;
  })();

  return (
    <View style={styles.row} accessibilityLabel={`${title}, ${state}`}>
      <View style={styles.indicatorColumn}>
        <View style={styles.indicator}>{indicator}</View>
        {!isLast && (
          <View
            style={[
              styles.connector,
              {
                backgroundColor:
                  state === 'complete' ? theme.colors.success : theme.colors.border,
              },
            ]}
          />
        )}
      </View>
      <View style={{ flex: 1, paddingBottom: isLast ? 0 : theme.spacing.lg }}>
        <Text
          style={[
            theme.typography.bodyStrong,
            { color: titleColor },
          ]}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  indicatorColumn: {
    alignItems: 'center',
    marginRight: 16,
  },
  indicator: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  circleText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  connector: {
    width: 2,
    flex: 1,
    marginTop: 2,
  },
});
