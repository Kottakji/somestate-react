import { useState, useEffect } from "react";
import { Store, Fetched, Computed, Persistent } from "somestate";

/**
 * Custom hook for subscribing to changes in a store and returning the current value.
 *
 * @param {Store, Computed, Persistent, Fetched} store - The store object
 * @param {Array<string>|null} keys - Listen to these key changes (if the value is an object)
 * @returns {*} The current value of the store
 */
export const useStore = (store, keys = null) => {
  const [value, setValue] = useState(store.get());

  useEffect(() => {
    const listener = store.listen((value) => setValue(value), keys);

    return () => {
      // Unsubscribe the listener
      listener.unsubscribe();

      // Unsubscribe other dependencies
      store.clear();
    };
  }, []);

  return value;
};
