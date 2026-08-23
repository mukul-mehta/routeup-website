# Routeup

> Stable, trusted HTTPS names for local services. Public only when you choose.

Routeup is an open-source command-line developer tool for routing one or more local services behind memorable `*.localhost` HTTPS names. It can optionally expose the same routes through a hosted or self-hosted public server.

Routeup is local-first: local routing works offline, request-body capture is opt-in, and public exposure requires an explicit command or configuration.

## Start here

- [Install Routeup](https://routeup.dev/docs/getting-started/install.md): Install the CLI on macOS or Linux with Homebrew or the verified release installer.
- [Create your first route](https://routeup.dev/docs/getting-started/first-route.md): Set up trusted local HTTPS and route a development server.
- [Routeup Agent Skill](https://routeup.dev/docs/getting-started/agent-skill.md): Instructions for coding agents to install, configure, and use Routeup safely.
- [CLI reference](https://routeup.dev/docs/cli-reference/routeup.md): Command behavior and links to every Routeup subcommand.

## Common uses

- [Frontend and API behind one origin](https://routeup.dev/docs/recipes/frontend-plus-api.md): Route multiple local services by path without development CORS workarounds.
- [Webhook development](https://routeup.dev/docs/recipes/webhook-development.md): Expose only a webhook path to an external provider.
- [OAuth callbacks](https://routeup.dev/docs/recipes/oauth-callbacks.md): Keep a stable HTTPS redirect URI during development.
- [Mobile testing](https://routeup.dev/docs/recipes/mobile-testing.md): Open a local application on another device.
- [Agent and browser testing](https://routeup.dev/docs/recipes/agent-browser-testing.md): Give remote browser automation an explicit, temporary route to a local service.

## Resources

- [Agent documentation index](https://routeup.dev/llms.txt): Curated guidance and links to every Markdown documentation page.
- [Full documentation](https://routeup.dev/llms-full.txt): The complete documentation corpus in one text file.
- [Source code](https://github.com/mukul-mehta/routeup): MIT-licensed source, issue tracker, and contribution history.
- [Latest release](https://github.com/mukul-mehta/routeup/releases/latest): Release notes and verified binaries.
- [Privacy](https://routeup.dev/privacy.md): Data handling for the Routeup website and hosted-token request form.
- [Sitemap](https://routeup.dev/sitemap-index.xml): Index of human-readable pages.
