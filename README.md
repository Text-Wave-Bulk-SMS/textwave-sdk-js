<p align="center">
  <img src="logo.svg" alt="TextWave SDK" width="120" height="120">
</p>

<h1 align="center">TextWave SDK</h1>

<p align="center">
  Official JavaScript/TypeScript SDK for the <a href="https://textwave.co.ke">TextWave</a> Bulk SMS API.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/textwave-sdk"><img src="https://img.shields.io/npm/v/textwave-sdk.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/textwave-sdk"><img src="https://img.shields.io/npm/dm/textwave-sdk.svg" alt="npm downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg" alt="Node.js"></a>
</p>

<p align="center">
  <strong>Send bulk SMS in Kenya with ease. Built for developers.</strong>
</p>

---

## Installation

```bash
npm install textwave-sdk
```

```bash
yarn add textwave-sdk
```

```bash
pnpm add textwave-sdk
```

## Quick Start

```typescript
import { TextWave } from 'textwave-sdk';

const client = new TextWave('your_api_key');

// Send SMS
const result = await client.sendSms('254712345678', 'Hello from TextWave!');
console.log(`Sent: ${result.data.totalSent}`);
```

## Usage

### Initialize the Client

```typescript
import { TextWave } from 'textwave-sdk';

// With API key only (uses default API URL)
const client = new TextWave('tw_xxxxxxxxxxxxxxxx');

// With custom API URL
const client = new TextWave('tw_xxxxxxxxxxxxxxxx', 'https://api.textwave.co.ke/v1');
```

### Send SMS

```typescript
// Single recipient
await client.sendSms('254712345678', 'Hello!');

// Multiple recipients (bulk)
await client.sendSms(
  ['254712345678', '254723456789', '254734567890'],
  'Bulk message to all!'
);

// With custom sender ID
await client.sendSms('254712345678', 'Hello!', 'MyBrand');
```

### Check Balance

```typescript
const balance = await client.getBalance();
console.log(`SMS Credits: ${balance.data.smsCredits}`);
```

### Get Message History

```typescript
// Get recent messages
const history = await client.getHistory();

// With pagination and filters
const filtered = await client.getHistory({
  page: 1,
  limit: 50,
  status: 'delivered'
});

history.data.messages.forEach(msg => {
  console.log(`${msg.phone}: ${msg.status}`);
});
```

### Get Transactions

```typescript
const transactions = await client.getTransactions(1, 20);

transactions.data.transactions.forEach(tx => {
  console.log(`${tx.type}: ${tx.smsCredits} SMS - ${tx.description}`);
});
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import { 
  TextWave,
  SendSmsResponse,
  HistoryResponse,
  BalanceResponse,
  Message,
  Transaction 
} from 'textwave-sdk';
```

## Error Handling

```typescript
try {
  await client.sendSms('254712345678', 'Hello!');
} catch (error) {
  if (error.code === 'INSUFFICIENT_CREDITS') {
    console.log('Please top up your wallet');
  } else if (error.code === 'UNAUTHORIZED') {
    console.log('Invalid API key');
  } else {
    console.log('Error:', error.message);
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing API key |
| `INSUFFICIENT_CREDITS` | Not enough SMS credits |
| `INVALID_PHONE` | Invalid phone number format |
| `RATE_LIMITED` | Too many requests |
| `VALIDATION_ERROR` | Request validation failed |

## Get Your API Key

1. Sign up at [textwave.co.ke](https://textwave.co.ke)
2. Go to **Dashboard → Settings → API Keys**
3. Click **Generate API Key**
4. Copy and use in your application

## Requirements

- Node.js 18+ (uses native `fetch`)
- Or any environment with `fetch` support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## Support

- Website: [textwave.co.ke](https://textwave.co.ke)
- Email: support@textwave.co.ke
- Issues: [GitHub Issues](https://github.com/Text-Wave-Bulk-SMS/textwave-sdk-js/issues)

## License

MIT © [TextWave](https://textwave.co.ke)
