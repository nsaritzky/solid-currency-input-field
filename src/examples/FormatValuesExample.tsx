import { Component, JSX, createSignal } from 'solid-js'
import { formatValue } from '../components/utils'

const FormatValuesExample: Component = () => {
  const [value, setValue] = createSignal('123456789.999')
  const [prefix, setPrefix] = createSignal('$')
  const [groupSeparator, setGroupSeparator] = createSignal(',')
  const [decimalSeparator, setDecimalSeparator] = createSignal('.')
  const [disableGroupSeparators, setdisableGroupSeparators] = createSignal(false)

  type ChangeHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>

  const handleValueChange: ChangeHandler = ({ target: { value } }) => {
    setValue(value)
  }

  const handlePrefixChange: ChangeHandler = ({ target: { value } }) => {
    setPrefix(value)
  }

  const handleGroupSeparatorChange: ChangeHandler = ({ target: { value } }) => {
    setGroupSeparator(value)
  }

  const handleDecimalSeparatorChange: ChangeHandler = ({
    target: { value: newDecimalSeparator },
  }) => {
    setDecimalSeparator(newDecimalSeparator)
  }

  const handleTurnOffSeparatorChange: ChangeHandler = ({ target: { value } }) => {
    setdisableGroupSeparators(value === 'true' ? true : false)
  }

  return (
    <div class="row">
      <div class="col-12 mb-4">
        <a href="https://github.com/cchanxzy/react-currency-input-field/blob/master/src/examples/FormatValuesExample.tsx">
          <h2>Format values example</h2>
        </a>
        <ul>
          <li>Use the `formatValue` function convert a value to a user friendly string</li>
        </ul>
        <div class="col-10">
          <div class="row mt-3">
            <div class="col">
              <label>Value (Number only)</label>
              <input
                type="number"
                class="form-control"
                value={value()}
                onChange={handleValueChange}
              />
            </div>
            <div class="col-3">
              <label>Prefix</label>
              <input
                type="text"
                class="form-control"
                value={prefix()}
                onChange={handlePrefixChange}
              />
            </div>
            <div class="col-3">
              <label>Group Separator</label>
              <input
                type="text"
                class="form-control"
                value={groupSeparator()}
                onChange={handleGroupSeparatorChange}
              />
            </div>
            <div class="col-3">
              <label>Decimal Separator</label>
              <input
                type="text"
                class="form-control"
                value={decimalSeparator()}
                onChange={handleDecimalSeparatorChange}
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col mt-3">
              Turn off separators:
              <div class="ml-3 custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="disableGroupSeparatorsTrue"
                  class="custom-control-input"
                  value="true"
                  onChange={handleTurnOffSeparatorChange}
                  checked={disableGroupSeparators()}
                />
                <label class="custom-control-label" for="disableGroupSeparatorsTrue">
                  True
                </label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="disableGroupSeparatorsFalse"
                  class="custom-control-input"
                  value="false"
                  onChange={handleTurnOffSeparatorChange}
                  checked={disableGroupSeparators() === false}
                />
                <label class="custom-control-label" for="disableGroupSeparatorsFalse">
                  False
                </label>
              </div>
            </div>
          </div>
          <div class="mt-5">
            Formatted value:
            <div class="display-4">
              {formatValue({
                value: value(),
                groupSeparator: groupSeparator(),
                decimalSeparator: decimalSeparator(),
                disableGroupSeparators: disableGroupSeparators(),
                prefix: prefix(),
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormatValuesExample
