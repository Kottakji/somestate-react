# Somestate React

## Install

```bash
npm install somestate-react
```

## Documentation

More docs available at https://github.com/Kottakji/somestate

## Hooks

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

```js
import { useStore } from 'somestate/react'
import { fetched } from 'somestate'

// Or import it from src/stores/countStore.js
const $todos = fetched(`https://jsonplaceholder.typicode.com/todos`)

export const Todos = () => {
  const {data: todos, loading, error} = useStore($todos)

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
