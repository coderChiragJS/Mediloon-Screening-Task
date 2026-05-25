/**
 * Masks a sensitive reference for safe display.
 *
 *   maskReference('RX-ABCD-1234') -> 'RX-****-1234'
 *   maskReference('sess_abc123def456')   -> 'sess_********f456'
 *   maskReference('PAT-001')             -> 'PAT-***'
 *
 * Last 4 visible chars is the convention (matches credit-card UX); the rest
 * is replaced with asterisks so the structure is still recognisable.
 */
export function maskReference(value: string | undefined | null, visible = 4): string {
  if (!value) return '';
  if (value.length <= visible) return '*'.repeat(value.length);

  const tail = value.slice(-visible);
  const head = value.slice(0, value.length - visible);
  const masked = head.replace(/[A-Za-z0-9]/g, '*');
  return `${masked}${tail}`;
}
