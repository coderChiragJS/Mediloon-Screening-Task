import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  label: string;
  value: string;
  monospace?: boolean;
}

export function DataRow({ label, value, monospace = false }: Props) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: theme.colors.border, paddingVertical: theme.spacing.md },
      ]}
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={[theme.typography.label, { color: theme.colors.textMuted }]}>{label}</Text>
      <Text
        style={[
          monospace ? theme.typography.mono : theme.typography.bodyStrong,
          { color: theme.colors.text, marginTop: 4 },
        ]}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
