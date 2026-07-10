---
name: New protocol message
description: Create a new protocol message from core/gui to core/gui
alwaysApply: false
---

Create a new protocol message by taking the following steps:

## 1. Define the message type

Add your new message type definition to the appropriate file in the `protocol/` directory with correct TypeScript typing.

## 2. Check for duplicates

Verify that no existing message type already provides the same functionality.

## 3. Add to passThrough (if webview ↔ core)

If your message is between webview and core, add it to `core/protocol/passThrough.ts`.

## 4. Implement the message handler

Implement the message in the appropriate location:

- **Messages to core**: `core/core.ts`
- **Messages to GUI**: `useWebviewListener` hook

## 5. Test the message

Add or update tests to cover the new message flow.
