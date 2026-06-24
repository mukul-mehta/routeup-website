import { Command } from 'cmdk';
import { useEffect, useState } from 'react';

/**
 * Placeholder command palette (Cmd/Ctrl + K).
 *
 * Currently a no-op shell. Starlight's built-in Pagefind search already
 * binds Cmd/Ctrl + K on docs pages, so this is wired only for non-docs
 * routes (marketing landing, future dashboard) and is intentionally
 * minimal until a real action list is needed.
 *
 * To wire it in:
 *   import CommandPalette from '../components/CommandPalette';
 *   <CommandPalette client:idle />
 *
 * Future actions to add:
 *   - Search docs (Pagefind index)
 *   - Copy install command
 *   - Open GitHub
 *   - Copy page as Markdown
 *   - View page as Markdown (/<slug>.md)
 *   - Jump to changelog / releases
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'grid',
        placeItems: 'start center',
        paddingTop: '15vh',
        zIndex: 9999,
      }}
      onClick={() => setOpen(false)}
    >
      <Command
        label="Command palette"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(600px, 90vw)',
          background: 'var(--bg, white)',
          color: 'var(--fg, black)',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        <Command.Input
          placeholder="Search docs and actions..."
          style={{
            width: '100%',
            padding: '1rem',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'inherit',
            fontSize: '1rem',
          }}
        />
        <Command.List style={{ maxHeight: 360, overflowY: 'auto', padding: '0.5rem' }}>
          <Command.Empty>No results.</Command.Empty>
          <Command.Group heading="Pages">
            <Command.Item onSelect={() => (window.location.href = '/')}>
              Home
            </Command.Item>
            <Command.Item onSelect={() => (window.location.href = '/docs')}>
              Docs
            </Command.Item>
          </Command.Group>
          <Command.Group heading="Actions">
            <Command.Item
              onSelect={() => {
                navigator.clipboard.writeText('brew install mukul-mehta/tap/routeup');
                setOpen(false);
              }}
            >
              Copy install command
            </Command.Item>
            <Command.Item
              onSelect={() => {
                window.open('https://github.com/mukul-mehta/routeup', '_blank');
                setOpen(false);
              }}
            >
              Open GitHub
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
