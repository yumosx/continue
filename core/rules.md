# `core` rules

Whenever a new protocol message is added to the `protocol/` directory, check the following:

- Its type is defined correctly
- If it is a message from webview to core or vice versa:
  - It has been added to `core/protocol/passThrough.ts`
- It is implemented in `core/core.ts` (for messages to the core) or in a `useWebviewListener` (for messages to the gui)
- It does not duplicate functionality from another message type that already exists
