import { defineEcConfig } from '@astrojs/starlight/expressive-code';

export default defineEcConfig({
  useStarlightDarkModeSwitch: false,
  useStarlightUiThemeColors: false,
  defaultProps: {
    overridesByLang: {
      'bash,sh,shell,zsh,powershell,ps1': {
        frame: 'terminal',
        title: 'terminal',
      },
    },
  },
  frames: {
    showCopyToClipboardButton: true,
    removeCommentsWhenCopyingTerminalFrames: true,
  },
  styleOverrides: {
    borderRadius: '5px',
    borderWidth: '1px',
    codeFontFamily: 'var(--ru-mono)',
    codeFontSize: '0.8125rem',
    codeLineHeight: '1.8',
    codePaddingBlock: '0.875rem',
    codePaddingInline: '1rem',
    uiFontFamily: 'var(--ru-mono)',
    uiFontSize: '0.6875rem',
    uiLineHeight: '1.4',
  },
});
