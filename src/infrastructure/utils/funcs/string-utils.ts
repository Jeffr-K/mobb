export function fixedWidthPadEnd(str: string, length: number, padChar = ' '): string {
  const visibleLength = str.replace(/\u001b\[\d+m/g, '').length; // ANSI 색상 코드 제거
  const paddingLength = Math.max(0, length - visibleLength);
  return str + padChar.repeat(paddingLength);
}