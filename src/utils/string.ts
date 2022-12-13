export const generateHex = (length: number = 32) => {
  return Array.from({ length }, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))).join('');
}
