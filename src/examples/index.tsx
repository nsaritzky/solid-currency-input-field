import { render } from 'solid-js/web'

import Example1 from './Example1'
import Example2 from './Example2'
import Example3 from './Example3'
import Example4 from './Example4'
import FormatValuesExample from './FormatValuesExample'

render(() => <Example1 />, document.getElementById('example-1')!)

render(() => <Example2 />, document.getElementById('example-2')!)

render(() => <Example3 />, document.getElementById('example-3')!)

render(() => <Example4 />, document.getElementById('example-4')!)

render(() => <FormatValuesExample />, document.getElementById('format-values-example')!)
