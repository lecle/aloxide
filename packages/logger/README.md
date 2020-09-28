<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of content**

- [Package `@aloxide/logger`](#package-aloxidelogger)
  - [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Package `@aloxide/logger`

This is a simple logger interface allows use any available logger.

## Usage

```typescript
// typescript
import type { Logger } from '@aloxide/logger';
```

It also provides a colorized console-log:

```typescript
// typescript
import { createLogger } from '@aloxide/logger';

declare global {
  var logger: Logger;
}

// if consoleLogger is set to false, the function will create a null logger
// which do nothing with log
global.logger = createLogger({ consoleLogger: true });

logger.debug('Set up logger');
```
