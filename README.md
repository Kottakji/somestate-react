# Somestate React

## Install

```bash
npm install somestate-react
```

## Documentation

More docs available at https://github.com/Kottakji/somestate

## Hooks

### useStore

```js
import { useStore } from 'somestate/react'
import { store } from 'somestate'

// Or import it from src/stores/countStore.js
const $count = store(0);

export const Example = () => {
  const count = useStore($count)

  return (
    <div>
        <p>Total: {count}</p>
        <button onClick={() => $count.set($count.get() + 1)}/>
    </div>
  )
}
```

### useFetched

This includes the data, loading and error values that can be destructured.

```js
import { useStore } from 'somestate/react'
import { fetched } from 'somestate'

// Or import it from src/stores/countStore.js
const $todos = fetched(`https://jsonplaceholder.typicode.com/todos`)

export const Todos = () => {
  const {data: todos, loading, error} = useFetched($todos)

  if (loading) {
    return <></>
  }

  return (
    <ul>
        {todos.map(todo => <li>{todo.id}</li>)}
    </ul>
  )
}
```
