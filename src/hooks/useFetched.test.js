import { describe, expect, test } from "@jest/globals";
import {
  render,
  screen,
  waitFor,
  act,
  findByText,
} from "@testing-library/react";
import { fetched } from "somestate/src/fetched";
import { useEffect } from "react";
import { useFetched } from "./useFetched";

describe("useFetched", () => {
  test("We can listen to the loading value", async () => {
    const $todo = fetched(`https://jsonplaceholder.typicode.com/todos/1`);

    const Component = () => {
      const { data: todo, loading, error } = useFetched($todo);

      return <p data-testid="id">{loading ? "Loading" : todo?.id}</p>;
    };

    render(<Component />);
    expect(screen.getByTestId("id")).toHaveTextContent("Loading");

    await waitFor(() => {
      expect(screen.getByTestId("id")).toHaveTextContent("1");
    });
  });

  test("We can listen to the error value", async () => {
    const $todo = fetched(`https://jsonplaceholder.typicode.com/invalid-url`);

    const Component = () => {
      const { data: todo, loading, error } = useFetched($todo);

      return (
        <p data-testid="id">
          {loading ? "Loading" : error ? error.status : todo?.id}
        </p>
      );
    };

    render(<Component />);
    expect(screen.getByTestId("id")).toHaveTextContent("Loading");

    await waitFor(() => {
      expect(screen.getByTestId("id")).toHaveTextContent("404");
    });
  });
});
