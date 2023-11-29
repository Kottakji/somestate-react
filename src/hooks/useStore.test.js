import { describe, expect, test } from "@jest/globals";
import { store } from "somestate";
import { useStore } from "./useStore.js";
import renderer, { act, unstable_batchedUpdates } from "react-test-renderer";
import { computed } from "somestate/src/computed";
import { fetched } from "somestate/src/fetched";
import { useEffect } from "react";

describe("useStore", () => {
  test("We can listen to store changes", () => {
    const $store = store(0);

    const Component = () => {
      const value = useStore($store);

      return <p>{value}</p>;
    };

    const component = renderer.create(<Component />);
    expect(component.toJSON()).toEqual(renderer.create(<p>0</p>).toJSON());

    act(() => {
      $store.set(1);
    });

    expect(component.toJSON()).toEqual(renderer.create(<p>1</p>).toJSON());
  });

  test("We can have a computed value", () => {
    const $items = store([1, 2, 3]);
    const $even = computed($items, (items) =>
      items.filter((item) => item % 2 === 0),
    );

    const Component = () => {
      const value = useStore($even);

      return <p>{value.length}</p>;
    };

    const component = renderer.create(<Component />);
    expect(component.toJSON()).toEqual(renderer.create(<p>1</p>).toJSON());

    act(() => {
      $items.set([1, 2, 3, 4]);
    });

    expect(component.toJSON()).toEqual(renderer.create(<p>2</p>).toJSON());
  });

  test("We can have a fetched value", (done) => {
    // Ignore require using at(), unsure how to remove this log, it should still fail if done is not called
    console.error = () => {};

    const $todo = fetched(`https://jsonplaceholder.typicode.com/todos/1`);

    const Component = () => {
      const todo = useStore($todo);

      useEffect(() => {
        if (todo?.id === 1) {
          done();
        }
      });

      return <p>{todo?.id}</p>;
    };

    renderer.create(<Component />);
  });

  test("When the component is unmounted, the listener is cleared", async () => {
    const $todo = fetched(`https://jsonplaceholder.typicode.com/todos/1`);

    const Component = () => {
      const todo = useStore($todo);

      return <p>{todo?.id}</p>;
    };

    let unmount;
    await act(() => {
      const result = renderer.create(<Component />);
      unmount = result.unmount;
    });

    expect($todo.listeners.length).toEqual(1);

    await act(() => {
      unmount();
    });

    act(() => {
      expect($todo.listeners.length).toEqual(0);
    });
  });
});
