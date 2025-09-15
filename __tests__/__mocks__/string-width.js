// Mock implementation of string-width for Jest tests
function stringWidth(str) {
  if (typeof str !== 'string') return 0;

  // Simple width calculation that handles common full-width characters
  let width = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Check for full-width characters (common CJK ranges)
    if (
      (code >= 0x1100 && code <= 0x115f) || // Hangul
      (code >= 0x2e80 && code <= 0x2eff) || // CJK Radicals
      (code >= 0x2f00 && code <= 0x2fdf) || // Kangxi Radicals
      (code >= 0x3000 && code <= 0x303f) || // CJK Symbols and Punctuation
      (code >= 0x3040 && code <= 0x309f) || // Hiragana
      (code >= 0x30a0 && code <= 0x30ff) || // Katakana
      (code >= 0x3100 && code <= 0x312f) || // Bopomofo
      (code >= 0x3200 && code <= 0x32ff) || // Enclosed CJK
      (code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
      (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
      (code >= 0xf900 && code <= 0xfaff)    // CJK Compatibility
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

module.exports = stringWidth;
module.exports.default = stringWidth;