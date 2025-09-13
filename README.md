# ink-title-box

A customizable title box component for [Ink](https://github.com/vadimdemedes/ink) CLI applications.

## Installation

```bash
npm install ink-title-box
```

## Requirements

- Node.js >=18.0.0
- React ^18.3.1
- Ink ^4.4.1

## Usage

### As a CLI Tool

```bash
# Basic usage
npx ink-title-box "Hello World"

# With options
npx ink-title-box "My Title" --width 60 --color green --padding 2
```

#### CLI Options

- `-w, --width <number>` - Set box width (default: 40, max: 200)
- `-p, --padding <number>` - Set box padding (default: 1, max: 10)
- `-c, --color <color>` - Set border color (default: blue)
- `-h, --help` - Show help message

#### Valid Colors

`black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`, `grey`, `blackBright`, `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`

### As a React Component

```tsx
import React from 'react';
import { render } from 'ink';
import { TitleBox } from 'ink-title-box';

const App = () => (
  <TitleBox
    title="My Application"
    width={50}
    padding={2}
    borderColor="cyan"
  />
);

render(<App />);
```

#### Component Props

```typescript
interface TitleBoxProps {
  title: string;
  width?: number;        // Box width (default: 40)
  padding?: number;      // Internal padding (default: 1)
  borderColor?: string;  // Border color (default: 'blue')
}
```

## Development

### Scripts

```bash
npm run build        # Build the project
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript checks
npm run quality      # Run all quality checks
npm run ci           # Run CI pipeline locally
```

### Testing

The project uses Jest with 100% test coverage:

```bash
npm test                    # Run all tests
npm run test:coverage      # Run with coverage report
npm run test:ci           # Run in CI mode
```

### Code Quality

- **TypeScript** - Strict type checking
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Jest** - Testing with full coverage

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run quality checks (`npm run quality`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Make sure all tests pass and maintain 100% coverage.