<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-currency-input-field&background=tiles&project=%20" alt="solid-currency-input-field">
</p>

# solid-currency-input-field

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Solid JS <input/> component for formatting currency and numbers. Ported from [react-currency-input-field](https://github.com/cchanxzy/react-currency-input-field).

## Quick start

Install it:

```bash
npm i solid-currency-input-field
# or
yarn add solid-currency-input-field
# or
pnpm add solid-currency-input-field
```

Use it:

```tsx
import solid-currency-input-field from 'solid-currency-input-field'
```

# Solid Currency Input Field Component

- [Solid Currency Input Field Component](#solid-currency-input-field-component)
  - [Features](#features)
  - [Examples](#examples)
  - [Usage](#usage)
  - [Props](#props)
    - [Abbreviations](#abbreviations)
    - [Prefix and Suffix](#prefix-and-suffix)
    - [Separators](#separators)
    - [Intl Locale Config](#intl-locale-config)
    - [Decimal Scale and Decimals Limit](#decimal-scale-and-decimals-limit)
    - [Fixed Decimal Length](#fixed-decimal-length)
  - [Format values for display](#format-values-for-display)

## Features

- Allows [abbreviations](#abbreviations) e.g. 1k = 1,000 2.5m = 2,500,000
- Prefix and Suffix options e.g. £ or \$
- Automatically inserts [group separator](#separators)
- Accepts [Intl locale config](#intl-locale-config)
- Can use arrow down/up to step
- Can allow/disallow decimals
- Written in TypeScript and has type support
- Does not use any third party packages

## Examples

[Play with demo](https://cchanxzy.github.io/react-currency-input-field) or view [examples code](https://github.com/cchanxzy/solid-currency-input-field/blob/master/src/examples)

[![React Currency Input Demo](demo/demo.gif)](https://cchanxzy.github.io/react-currency-input-field)

## Usage

```js
import CurrencyInput from 'solid-currency-input-field'
;<CurrencyInput
  id="input-example"
  name="input-name"
  placeholder="Please enter a number"
  defaultValue={1000}
  decimalsLimit={2}
  onValueChange={(value, name) => console.log(value, name)}
/>
```

Have a look in [`src/examples`](https://github.com/nsaritzky/solid-currency-input-field/tree/master/src/examples) for more examples on implementing and validation.

## Props

| Name                                               | Type       | Default        | Description                                                                                    |
| -------------------------------------------------- | ---------- | -------------- | ---------------------------------------------------------------------------------------------- |
| allowDecimals                                      | `boolean`  | `true`         | Allow decimals                                                                                 |
| allowNegativeValue                                 | `boolean`  | `true`         | Allow user to enter negative value                                                             |
| defaultValue                                       | `number`   |                | Default value                                                                                  |
| value                                              | `number`   |                | Programmatically set the value                                                                 |
| onValueChange                                      | `function` |                | Handle change in value                                                                         |
| placeholder                                        | `string`   |                | Placeholder if no value                                                                        |
| [decimalsLimit](#decimal-scale-and-decimals-limit) | `number`   | `2`            | Limit length of decimals allowed                                                               |
| [decimalScale](#decimal-scale-and-decimals-limit)  | `number`   |                | Specify decimal scale for padding/trimming eg. 1.5 -> 1.50 or 1.234 -> 1.23 if decimal scale 2 |
| [fixedDecimalLength](#fixed-decimal-length)        | `number`   |                | Value will always have the specified length of decimals                                        |
| [prefix](#prefix-and-suffix)                       | `string`   |                | Include a prefix eg. £ or \$                                                                   |
| [suffix](#prefix-and-suffix)                       | `string`   |                | Include a suffix eg. € or %                                                                    |
| [decimalSeparator](#separators)                    | `string`   | locale default | Separator between integer part and fractional part of value                                    |
| [groupSeparator](#separators)                      | `string`   | locale default | Separator between thousand, million and billion                                                |
| [intlConfig](#intl-locale-config)                  | `object`   |                | International locale config                                                                    |
| disabled                                           | `boolean`  | `false`        | Disabled                                                                                       |
| disableAbbreviations                               | `boolean`  | `false`        | Disable abbreviations eg. 1k -> 1,000, 2m -> 2,000,000                                         |
| [disableGroupSeparators](#separators)              | `boolean`  | `false`        | Disable auto adding the group separator between values, eg. 1000 -> 1,000                      |
| maxLength                                          | `number`   |                | Maximum characters the user can enter                                                          |
| step                                               | `number`   |                | Incremental value change on arrow down and arrow up key press                                  |
| transformRawValue                                  | `function` |                | Transform the raw value from the input before parsing. Needs to return `string`.               |

### Abbreviations

It can parse values with abbreviations `k`, `m` and `b`

Examples:

- 1k = 1,000
- 2.5m = 2,500,000
- 3.456B = 3,456,000,000

This can be turned off by passing in `disableAbbreviations`.

### Prefix and Suffix

You can add a prefix or suffix by passing in `prefix` or `suffix`.

```js
import CurrencyInput from 'solid-currency-input-field'
;<CurrencyInput prefix="£" value={123} />
// £123
;<CurrencyInput suffix="%" value={456} />
// 456%
```

Note: Passing in prefix/suffix will override the intl locale config.

### Separators

You can change the decimal and group separators by passing in `decimalSeparator` and `groupSeparator`.

Example:

```js
import CurrencyInput from 'solid-currency-input-field'
;<CurrencyInput decimalSeparator="," groupSeparator="." />
```

Note: the separators cannot be a number, and `decimalSeparator` must be different to `groupSeparator`.

To turn off auto adding the group separator, add `disableGroupSeparators={true}`.

### Intl Locale Config

This component can also accept international locale config to format the currency to locale setting.

Examples:

```javascript
import CurrencyInput from 'react-currency-input-field'
;<CurrencyInput intlConfig={{ locale: 'en-US', currency: 'GBP' }} />
;<CurrencyInput intlConfig={{ locale: 'ja-JP', currency: 'JPY' }} />
;<CurrencyInput intlConfig={{ locale: 'en-IN', currency: 'INR' }} />
```

`locale` should be a [BCP 47 language tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation), such as "en-US" or "en-IN".

`currency` should be a [ISO 4217 currency code](https://en.wikipedia.org/wiki/ISO_4217), such as "USD" for the US dollar, "EUR" for the euro, or "CNY" for the Chinese RMB.

Any prefix, suffix, group separator and decimal separator options passed in will override the default locale settings.

### Decimal Scale and Decimals Limit

`decimalsLimit` and `decimalScale` sound similar but have different usages.

`decimalsLimit` prevents the user from typing more than the limit, and `decimalScale` will format the decimals `onBlur` to the specified length, padding or trimming as necessary.

Example:

```md
If decimalScale is 2

- 1.5 becomes 1.50 (padded)
- 1.234 becomes 1.23 (trimmed)

---

If decimalLimit is 2

- User enters 1.23
- User is then prevented from entering another value
```

### Fixed Decimal Length

Use `fixedDecimalLength` so that the value will always have the specified length of decimals.

This formatting happens onBlur.

Example if `fixedDecimalLength` was 2:

```md
- 1 -> 1.00 -> 1.23
- 12.3 -> 12.30
- 12.34 -> 12.34
```

## Format values for display

Use the `formatValue` function to format the values to a more user friendly string. This is useful if you are displaying the value somewhere else ie. the total of multiple inputs.

```javascript
import { formatValue } from 'solid-currency-input-field'

// Format using prefix, groupSeparator and decimalSeparator
const formattedValue1 = formatValue({
  value: '123456',
  groupSeparator: ',',
  decimalSeparator: '.',
  prefix: '$',
})

console.log(formattedValue1)
// $123,456

// Format using intl locale config
const formattedValue2 = formatValue({
  value: '500000',
  intlConfig: { locale: 'en-IN', currency: 'INR' },
})

console.log(formattedValue2)
// ₹5,00,000
```
