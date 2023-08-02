import { createStore, reconcile } from 'solid-js/store'
import CurrencyInput, { formatValue } from '..'
import { Component } from 'solid-js'

type Reducer<S, A> = (s: S, a: A) => S

const useReducer = <S extends {}, A>(reducer: Reducer<S, A>, state: S) => {
  const [store, setStore] = createStore(state)
  const dispatch = (action: A) => {
    state = reducer(state, action)
    setStore(reconcile(state))
  }
  return [store, dispatch] as const
}

type Field = {
  value: number | undefined
  validationClass: string
  errorMessage: string
}

type ExampleState = {
  field1: Field
  field2: Field
}

type Action = {
  fieldName: string
  value: Field
}

function reducer(state: ExampleState, { fieldName, value }: Action): ExampleState {
  return {
    ...state,
    [fieldName]: value,
  }
}

const initialState: ExampleState = {
  field1: {
    value: 100,
    validationClass: '',
    errorMessage: '',
  },
  field2: {
    value: 200,
    validationClass: '',
    errorMessage: '',
  },
}

export const Example4: Component = () => {
  const prefix = '£'
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleOnValueChange = (_value: string | undefined, fieldName: string | undefined): void => {
    if (!fieldName) {
      return
    }

    if (!_value) {
      return dispatch({
        fieldName,
        value: {
          value: undefined,
          validationClass: '',
          errorMessage: '',
        },
      })
    }

    const value = Number(_value)

    if (!Number.isNaN(value)) {
      dispatch({
        fieldName,
        value: {
          value,
          validationClass: 'is-valid',
          errorMessage: '',
        },
      })
    } else {
      dispatch({
        fieldName,
        value: {
          value,
          validationClass: 'is-invalid',
          errorMessage: 'Please enter a valid number',
        },
      })
    }
  }

  const total = () => (state.field1.value || 0) + (state.field2.value || 0)

  return (
    <div class="row">
      <div class="col-12 mb-4">
        <a href="https://github.com/cchanxzy/react-currency-input-field/blob/master/src/examples/Example4.tsx">
          <h2>Example 4</h2>
        </a>
        <ul>
          <li>Add two values together</li>
          <li>Format the total value</li>
        </ul>

        <form class="needs-validation">
          <div class="row">
            <div class="col">
              <label for="validation-example-3-field1">Value 1</label>
              <CurrencyInput
                id="validation-example-3-field1"
                name="field1"
                class={`form-control ${state.field1.validationClass}`}
                value={state.field1.value}
                onValueChange={handleOnValueChange}
                prefix={prefix}
              />
              <div class="invalid-feedback">{state.field1.errorMessage}</div>
            </div>

            <div class="col">
              <label for="validation-example-3-field2">Value 2</label>
              <CurrencyInput
                id="validation-example-3-field2"
                name="field2"
                class={`form-control ${state.field2.validationClass}`}
                value={state.field2.value}
                onValueChange={handleOnValueChange}
                prefix={prefix}
              />
              <div class="invalid-feedback">{state.field1.errorMessage}</div>
            </div>

            <div class="col">
              <div class="">
                <label>Total:</label>
                <div class="h3">{formatValue({ prefix, value: String(total()) })}</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Example4
