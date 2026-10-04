const sharedTokens = {
  background: '#070b14',
  'background-rgb': '7 11 20',
  black: '#000000',
  white: '#ffffff',
  'body-text': '#e2e8f0',
  'body-muted': '#cbd5e1',
  'body-subtle': '#94a3b8',
  'surface-rgb': '2 6 23',
  'neutral-rgb': '255 255 255',
  'syntax-key': '#7dd3fc',
  'syntax-string': '#86efac',
  'syntax-number': '#fcd34d',
  'syntax-comment': '#94a3b8',
  'syntax-flag': '#fbbf24',
  'accent-lime': '#5cff68',
  'accent-cyan': '#05caff',
  success: '#22c55e',
  danger: '#f87171',
  red: '#ee0000',
  qrDark: '#e2e8f0',
  qrLight: '#070b14',
  'font-sans': 'Inter, system-ui, sans-serif',
  'font-mono': '"JetBrains Mono", ui-monospace, monospace',
  'space-unit': '0.25rem'
};

export const themes = {
  kubernetes: {
    ...sharedTokens,
    50: '238 244 255', 100: '219 230 255', 200: '189 208 255', 300: '144 176 255',
    400: '91 131 251', 500: '50 108 229', 600: '35 84 207', 700: '28 67 168',
    800: '27 58 133', 900: '27 53 110', 'cyan-300': '103 232 249', 'cyan-400': '34 211 238',
    accent: '#326ce5', soft: '#90b0ff', highlight: '#38bdf8'
  },
  docker: {
    ...sharedTokens,
    50: '236 254 255', 100: '207 250 254', 200: '165 243 252', 300: '103 232 249',
    400: '34 211 238', 500: '6 182 212', 600: '8 145 178', 700: '14 116 144',
    800: '21 94 117', 900: '22 78 99', 'cyan-300': '165 243 252', 'cyan-400': '34 211 238',
    accent: '#06b6d4', soft: '#67e8f9', highlight: '#5cff68'
  },
  terraform: {
    ...sharedTokens,
    50: '250 245 255', 100: '243 232 255', 200: '233 213 255', 300: '216 180 254',
    400: '192 132 252', 500: '168 85 247', 600: '147 51 234', 700: '126 34 206',
    800: '107 33 168', 900: '88 28 135', 'cyan-300': '216 180 254', 'cyan-400': '192 132 252',
    accent: '#a855f7', soft: '#d8b4fe', highlight: '#38bdf8'
  },
  aws: {
    ...sharedTokens,
    50: '255 247 237', 100: '255 237 213', 200: '254 215 170', 300: '253 186 116',
    400: '251 146 60', 500: '249 115 22', 600: '234 88 12', 700: '194 65 12',
    800: '154 52 18', 900: '124 45 18', 'cyan-300': '253 186 116', 'cyan-400': '251 146 60',
    accent: '#f97316', soft: '#fdba74', highlight: '#facc15'
  },
  redhat: {
    ...sharedTokens,
    background: '#050508',
    'background-rgb': '5 5 8',
    'surface-rgb': '8 6 18',
    qrLight: '#050508',
    danger: '#ff6b6b',
    red: '#ee0000',
    50: '246 244 255', 100: '236 232 252', 200: '218 211 246', 300: '190 180 236',
    400: '160 146 222', 500: '132 118 209', 600: '104 88 184', 700: '78 62 150',
    800: '53 41 112', 900: '36 27 82', 'cyan-300': '153 224 220', 'cyan-400': '45 190 184',
    accent: '#8476d1', soft: '#c4b9f0', highlight: '#2dbeb8'
  },
  monochrome: {
    ...sharedTokens,
    50: '250 250 250', 100: '245 245 245', 200: '229 229 229', 300: '212 212 212',
    400: '163 163 163', 500: '115 115 115', 600: '82 82 82', 700: '64 64 64',
    800: '38 38 38', 900: '23 23 23', 'cyan-300': '229 229 229', 'cyan-400': '212 212 212',
    accent: '#a3a3a3', soft: '#e5e5e5', highlight: '#fff'
  }
};

export const brand = {
  name: 'Angel Cabrera',
  email: 'diablinux@gmail.com',
  company: '',
  logo: '',
  conference: '',
  questionUrl: 'https://example.com/questions'
};

export function applyTheme(name) {
  const theme = themes[name] ?? themes.kubernetes;
  const themeName = themes[name] ? name : 'kubernetes';
  const highContrast = matchMedia('(prefers-contrast: more)').matches;
  document.documentElement.dataset.theme = themeName;
  document.documentElement.dataset.contrast = highContrast ? 'more' : 'normal';
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) {
    themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    document.head.append(themeColorMeta);
  }
  themeColorMeta.content = highContrast ? theme.black : theme.background;
  Object.entries(theme).forEach(([key, value]) => {
    if (highContrast && (/^\d+$/.test(key) || key.startsWith('cyan-'))) value = '255 255 255';
    if (highContrast && ['accent', 'soft', 'highlight', 'red', 'body-text', 'body-muted', 'body-subtle', 'syntax-key', 'syntax-string', 'syntax-number', 'syntax-comment', 'syntax-flag', 'accent-lime', 'accent-cyan'].includes(key)) value = '#fff';
    if (highContrast && key === 'background') value = '#000';
    if (highContrast && key === 'background-rgb') value = '0 0 0';
    if (highContrast && key === 'surface-rgb') value = '0 0 0';
    document.documentElement.style.setProperty(
      key === 'accent' ? '--theme-accent' : key === 'soft' ? '--theme-accent-soft' : key === 'highlight' ? '--theme-highlight' : `--theme-${key}`,
      value
    );
  });
  return themeName;
}

matchMedia('(prefers-contrast: more)').addEventListener('change', () => {
  applyTheme(document.documentElement.dataset.theme);
});
