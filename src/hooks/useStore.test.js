import { describe, expect, test } from "@jest/globals";
import { store } from "somestate";
import { useStore } from "./useStore.js";
import { computed } from "somestate/src/computed";
import { fetched } from "somestate/src/fetched";
import { useEffect } from "react";
import { useFetched } from "./useFetched";
import { act, render, screen, waitFor } from "@testing-library/react";

describe("useStore", () => {
  test("We can listen to store changes", async () => {
    const $store = store(0);

    const Component = () => {
      const value = useStore($store);

      return <p data-testid="id">{value}</p>;
    };

    render(<Component />);
    expect(screen.getByTestId("id")).toHaveTextContent(0);

    act(() => void $store.set(1));

    expect(screen.getByTestId("id")).toHaveTextContent(1);
  });

  test("We can have a computed value", () => {
    const $items = store([1, 2, 3]);
    const $even = computed($items, (items) =>
      items.filter((item) => item % 2 === 0),
    );

    const Component = () => {
      const value = useStore($even);

      return <p data-testid="id">{value.length}</p>;
    };

    render(<Component />);
    expect(screen.getByTestId("id")).toHaveTextContent(1);

    act(() => {
      $items.set([1, 2, 3, 4]);
    });

    expect(screen.getByTestId("id")).toHaveTextContent(2);
  });

  test("We can have a fetched value", async () => {
    const $todo = fetched(`https://jsonplaceholder.typicode.com/todos/1`);

    const Component = () => {
      const todo = useStore($todo);

      return <p data-testid="id">{todo?.id}</p>;
    };

    render(<Component />);
    expect(screen.getByTestId("id")).not.toHaveTextContent("1");

    await waitFor(() => {
      expect(screen.getByTestId("id")).toHaveTextContent("1");
    });
  });

  test("When the component is unmounted, the listener is cleared", async () => {
    const $todo = fetched(`https://jsonplaceholder.typicode.com/todos/1`);

    const Component = () => {
      const todo = useStore($todo);

      return <p>{todo?.id}</p>;
    };

    const component = render(<Component />);

    expect($todo.listeners.length).toEqual(1);

    act(() => void component.unmount());

    await waitFor(() => {
      expect($todo.listeners.length).toEqual(0);
    });
  });

  test("We can listen to store changes, only when the keys change", async () => {
    const $store = store({ a: "a", b: "b" });

    const Component = () => {
      const value = useStore($store, ["a"]);

      return <p data-testid="id">{value.b}</p>;
    };

    render(<Component />);

    act(() => void $store.set({ a: "a", b: "c" }));

    await waitFor(() => {
      expect($store.get().b).toEqual("c");
    });

    act(() => void $store.set({ b: "d" }));

    await waitFor(() => {
      expect($store.get().b).not.toEqual("c");
    });
  });
});
