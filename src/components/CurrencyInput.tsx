import type { JSX } from 'solid-js'
import { createSignal, createEffect, createMemo, mergeProps, splitProps } from 'solid-js'
import { CurrencyInputProps, CurrencyInputOnChangeValues } from './CurrencyInputProps'
import {
  isNumber,
  cleanValue,
  fixedDecimalValue,
  formatValue,
  getLocaleConfig,
  padTrimValue,
  CleanValueOptions,
  getSuffix,
  FormatValueOptions,
  repositionCursor,
} from './utils'

export const CurrencyInput = (
  /* {
   *   allowDecimals = true,
   *   allowNegativeValue = true,
   *   id,
   *   name,
   *   className,
   *   customInput,
   *   decimalsLimit,
   *   defaultValue,
   *   disabled = false,
   *   maxLength: userMaxLength,
   *   value: userValue,
   *   onValueChange,
   *   fixedDecimalLength,
   *   placeholder,
   *   decimalScale,
   *   prefix,
   *   suffix,
   *   inputMode,
   *   intlConfig,
   *   step,
   *   min,
   *   max,
   *   disableGroupSeparators = false,
   *   disableAbbreviations = false,
   *   decimalSeparator: _decimalSeparator,
   *   groupSeparator: _groupSeparator,
   *   onChange,
   *   onFocus,
   *   onBlur,
   *   onKeyDown,
   *   onKeyUp,
   *   transformRawValue,
   *   ...props
   * } */
  baseProps: CurrencyInputProps,
) => {
  const mergedProps = mergeProps(
    {
      allowDecimals: true,
      allowNegativeValue: true,
      disabled: false,
      disableGroupSeparators: false,
      disableAbbreviations: false,
      inputMode: 'decimal' as const,
    },
    baseProps,
  )
  const [props, HTMLInputProps] = splitProps(mergedProps, [
    'transformRawValue',
    'onKeyUp',
    'onKeyDown',
    'onBlur',
    'onFocus',
    'onInput',
    'onChange',
    'groupSeparator',
    'decimalSeparator',
    'disableAbbreviations',
    'disableGroupSeparators',
    'max',
    'min',
    'step',
    'inputMode',
    'intlConfig',
    'suffix',
    'prefix',
    'decimalScale',
    'placeholder',
    'fixedDecimalLength',
    'onValueChange',
    'value',
    'maxLength',
    'disabled',
    'defaultValue',
    'decimalsLimit',
    'customInput',
    'class',
    'name',
    'id',
    'allowNegativeValue',
    'allowDecimals',
  ])
  createEffect(() => {
    if (props.decimalSeparator && isNumber(props.decimalSeparator)) {
      throw new Error('decimalSeparator cannot be a number')
    }

    if (props.groupSeparator && isNumber(props.groupSeparator)) {
      throw new Error('groupSeparator cannot be a number')
    }
  })

  const localeConfig = createMemo(() => getLocaleConfig(props.intlConfig))
  const decimalSeparator = createMemo(
    () => props.decimalSeparator || localeConfig().decimalSeparator || '',
  )
  const groupSeparator = createMemo(
    () => props.groupSeparator || localeConfig().groupSeparator || '',
  )

  createEffect(() => {
    if (
      decimalSeparator() &&
      groupSeparator() &&
      decimalSeparator() === groupSeparator() &&
      !props.disableGroupSeparators
    ) {
      throw new Error('decimalSeparator cannot be the same as groupSeparator')
    }
  })

  const formatValueOptions = createMemo(
    (): Partial<FormatValueOptions> => ({
      decimalSeparator: decimalSeparator(),
      groupSeparator: groupSeparator(),
      disableGroupSeparators: props.disableGroupSeparators,
      intlConfig: props.intlConfig,
      prefix: props.prefix || localeConfig().prefix,
      suffix: props.suffix,
    }),
  )

  const cleanValueOptions = (): Partial<CleanValueOptions> => ({
    decimalSeparator: decimalSeparator(),
    groupSeparator: groupSeparator(),
    allowDecimals: props.allowDecimals,
    decimalsLimit: props.decimalsLimit || props.fixedDecimalLength || 2,
    allowNegativeValue: props.allowNegativeValue,
    disableAbbreviations: props.disableAbbreviations,
    prefix: props.prefix || localeConfig().prefix,
    transformRawValue: props.transformRawValue,
  })

  const formattedStateValue = () =>
    props.defaultValue !== undefined
      ? formatValue({
          ...formatValueOptions(),
          decimalScale: props.decimalScale,
          value: String(props.defaultValue),
        })
      : props.value !== undefined
        ? formatValue({
            ...formatValueOptions(),
            decimalScale: props.decimalScale,
            value: String(props.value),
          })
        : ''

  // eslint-disable-next-line solid/reactivity
  const [stateValue, setStateValue] = createSignal(formattedStateValue())
  const [dirty, setDirty] = createSignal(false)
  const [cursor, setCursor] = createSignal(0)
  const [changeCount, setChangeCount] = createSignal(0)
  const [lastKeyStroke, setLastKeyStroke] = createSignal<string | null>(null)
  let inputRef: HTMLInputElement | undefined
  /* useImperativeHandle(props.ref, () => inputRef); */

  /**
   * Process change in value
   */
  const processChange = (value: string, selectionStart?: number | null): void => {
    setDirty(true)

    const { modifiedValue, cursorPosition } = repositionCursor({
      selectionStart,
      value,
      lastKeyStroke: lastKeyStroke(),
      stateValue: stateValue(),
      groupSeparator: groupSeparator(),
    })

    const stringValue = cleanValue({ value: modifiedValue, ...cleanValueOptions() })

    if (props.maxLength && stringValue.replace(/-/g, '').length > props.maxLength) {
      return
    }

    if (stringValue === '' || stringValue === '-' || stringValue === decimalSeparator()) {
      props.onValueChange &&
        props.onValueChange(undefined, props.name, { float: undefined, formatted: '', value: '' })
      setStateValue(stringValue)
      // Always sets cursor after '-' or decimalSeparator input
      setCursor(1)
      return
    }

    const stringValueWithoutSeparator = decimalSeparator()
      ? stringValue.replace(decimalSeparator(), '.')
      : stringValue

    const numberValue = parseFloat(stringValueWithoutSeparator)

    const formattedValue = formatValue({
      value: stringValue,
      ...formatValueOptions(),
    })

    if (cursorPosition !== undefined && cursorPosition !== null) {
      // Prevent cursor jumping
      let newCursor = cursorPosition + (formattedValue.length - value.length)
      newCursor = newCursor <= 0 ? (props.prefix ? props.prefix.length : 0) : newCursor

      setCursor(newCursor)
      setChangeCount(count => count + 1)
    }

    setStateValue(formattedValue)

    if (props.onValueChange) {
      const values: CurrencyInputOnChangeValues = {
        float: numberValue,
        formatted: formattedValue,
        value: stringValue,
      }
      props.onValueChange(stringValue, props.name, values)
    }
  }

  /**
   * Handle change event
   */
  const handleOnChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = event => {
    const {
      target: { value, selectionStart },
    } = event

    processChange(value, selectionStart)
    event.target.value = getRenderValue()
    event.target.setSelectionRange(cursor(), cursor())
    props.onChange && props.onChange(event)
  }

  const handleOnInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = event => {
    const {
      target: { value, selectionStart },
    } = event

    processChange(value, selectionStart)
    event.target.value = getRenderValue()
    event.target.setSelectionRange(cursor(), cursor())
    props.onInput && props.onInput(event)
  }

  /**
   * Handle focus event
   */
  const handleOnFocus: JSX.FocusEventHandler<HTMLInputElement, FocusEvent> = event => {
    props.onFocus && props.onFocus(event)
    return stateValue() ? stateValue().length : 0
  }

  /**
   * Handle blur event
   *
   * Format value by padding/trimming decimals if required by
   */
  const handleOnBlur: JSX.FocusEventHandler<HTMLInputElement, FocusEvent> = event => {
    const {
      target: { value },
    } = event

    const valueOnly = cleanValue({ value, ...cleanValueOptions() })

    if (valueOnly === '-' || valueOnly === decimalSeparator() || !valueOnly) {
      setStateValue('')
      props.onBlur && props.onBlur(event)
      return
    }

    const fixedDecimals = fixedDecimalValue(valueOnly, decimalSeparator(), props.fixedDecimalLength)

    const newValue = padTrimValue(
      fixedDecimals,
      decimalSeparator(),
      props.decimalScale !== undefined ? props.decimalScale : props.fixedDecimalLength,
    )

    const numberValue = parseFloat(newValue.replace(decimalSeparator(), '.'))

    const formattedValue = formatValue({
      ...formatValueOptions(),
      value: newValue,
    })

    if (props.onValueChange) {
      props.onValueChange(newValue, props.name, {
        float: numberValue,
        formatted: formattedValue,
        value: newValue,
      })
    }

    setStateValue(formattedValue)

    props.onBlur && props.onBlur(event)
  }

  /**
   * Handle key down event
   *
   * Increase or decrease value by step
   */
  const handleOnKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    const { key } = event

    setLastKeyStroke(key)

    if (props.step && (key === 'ArrowUp' || key === 'ArrowDown')) {
      event.preventDefault()
      setCursor(stateValue().length)

      const currentValue =
        parseFloat(
          props.value !== undefined
            ? String(props.value).replace(decimalSeparator(), '.')
            : cleanValue({ value: stateValue(), ...cleanValueOptions() }),
        ) || 0
      const newValue = key === 'ArrowUp' ? currentValue + props.step : currentValue - props.step

      if (props.min !== undefined && newValue < props.min) {
        return
      }

      if (props.max !== undefined && newValue > props.max) {
        return
      }

      const fixedLength = String(props.step).includes('.')
        ? Number(String(props.step).split('.')[1]?.length)
        : undefined

      processChange(
        String(fixedLength ? newValue.toFixed(fixedLength) : newValue).replace(
          '.',
          decimalSeparator(),
        ),
      )
    }

    props.onKeyDown && props.onKeyDown(event)
  }

  /**
   * Handle key up event
   *
   * Move cursor if there is a suffix to prevent user typing past suffix
   */
  const handleOnKeyUp: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    const {
      key,
      currentTarget: { selectionStart },
    } = event
    if (key !== 'ArrowUp' && key !== 'ArrowDown' && stateValue() !== '-') {
      const suffix = getSuffix(stateValue(), {
        groupSeparator: groupSeparator(),
        decimalSeparator: decimalSeparator(),
      })

      if (suffix && selectionStart && selectionStart > stateValue().length - suffix.length) {
        /* istanbul ignore else */
        if (inputRef) {
          const newCursor = stateValue().length - suffix.length
          inputRef.setSelectionRange(newCursor, newCursor)
        }
      }
    }

    props.onKeyUp && props.onKeyUp(event)
  }

  createEffect(() => {
    // prevent cursor jumping if editing value
    changeCount()
    if (dirty() && stateValue() !== '-' && inputRef && document.activeElement === inputRef) {
      inputRef.setSelectionRange(cursor(), cursor())
    }
  })

  /**
   * If user has only entered "-" or decimal separator,
   * keep the char to allow them to enter next value
   */
  const getRenderValue = createMemo(() => {
    if (
      props.value !== undefined &&
      stateValue() !== '-' &&
      (!decimalSeparator() || stateValue() !== decimalSeparator())
    ) {
      return formatValue({
        ...formatValueOptions(),
        decimalScale: dirty() ? undefined : props.decimalScale,
        value: String(props.value),
      })
    }
    return stateValue()
  })

  const inputProps = (): JSX.InputHTMLAttributes<HTMLInputElement> => ({
    ...HTMLInputProps,
    type: 'text',
    id: props.id,
    name: props.name,
    class: props.class,
    inputMode: props.inputMode,
    onChange: handleOnChange,
    onInput: handleOnInput,
    onBlur: handleOnBlur,
    onFocus: handleOnFocus,
    onKeyDown: handleOnKeyDown,
    onKeyUp: handleOnKeyUp,
    placeholder: props.placeholder,
    disabled: props.disabled,
    value: getRenderValue(),
  })

  /* if (props.customInput) {
   *   const CustomInput = props.customInput;
   *   return <CustomInput {...inputProps} />;
   * } */

  return <input {...inputProps()} ref={inputRef} />
}

export default CurrencyInput
