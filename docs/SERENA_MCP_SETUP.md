# Serena MCP Setup for VS Code Copilot

This guide explains how to use the Serena MCP server together with GitHub Copilot in VS Code for this repository.

## Prerequisites

- VS Code **1.102** or newer (MCP support went GA in this release).
- GitHub Copilot access with Chat agent mode enabled.
- The [`uv`](https://docs.astral.sh/uv/getting-started/installation/) toolchain on your PATH (provides the `uvx` runner used below).
- Optional: ability to trust workspace-level MCP configurations in VS Code.

## Workspace configuration

The repository ships with `.vscode/mcp.json` registering Serena as a stdio MCP server:

```json
{
  "servers": {
    "serena": {
      "type": "stdio",
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server",
        "--context",
        "ide-assistant",
        "--project",
        "${workspaceFolder}"
      ]
    }
  }
}
```

VS Code will prompt you to trust and start Serena when this workspace opens.

### First-time warm-up

Run the server once from the shell to download Serena and initialize language servers:

```bash
cd /home/lukasz/development/active/ki-tricks
uvx --from git+https://github.com/oraios/serena serena start-mcp-server \
  --context ide-assistant \
  --project "$(pwd)" \
  --transport streamable-http \
  --port 9121
```

Use <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop it after the startup completes. Subsequent launches from VS Code will reuse the cached installation. (You can omit the `--transport` flags when VS Code runs the server; they are only helpful when validating manually.)

### Optional indexing

For faster symbol lookups in large projects, ask Serena to index the repo:

```bash
uvx --from git+https://github.com/oraios/serena serena project index --project "$(pwd)"
```

This generates `.serena/` metadata inside the workspace.

## Using Serena in VS Code

1. Open the workspace in VS Code.
2. Confirm the trust prompt for the Serena MCP server.
3. Open Copilot Chat and switch to **Agent mode**.
4. Select **Tools → Serena** (or the hammer icon) to enable its capabilities.
5. Start chatting—Serena’s symbolic code tools will be available automatically. You can reference them explicitly with `#serena.findSymbol`, etc.

## Troubleshooting

- Use the **MCP: Show Installed Servers** command to confirm Serena appears and is running.
- If tools look outdated, run **MCP: Reset Cached Tools** or restart the server via the Command Palette.
- Serena logs live under `~/.serena/logs/…`; check them for stack traces or onboarding issues.
- VS Code stores configuration in `.vscode/mcp.json`. If you need the server globally, copy the same block into your user-level `mcp.json` (run **MCP: Open User Configuration**).
- To cleanly remove Serena from the workspace, delete `.vscode/mcp.json` and the generated `.serena/` directory.

## Further reading

- [Serena README](https://github.com/oraios/serena#readme) – advanced configuration, contexts, and tooling.
- [VS Code MCP guide](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) – official documentation on managing MCP servers in Copilot Chat.
