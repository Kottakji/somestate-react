import { useState, useEffect } from "react";
import { Store, Fetched, Computed, Persistent } from "somestate";

/**
 * @typedef {Object} Error
 * @param {number} status - The status code.
 * @param {string} body - The response body.
 */

/**
 * @typedef {Object} StoreResponse
 * @property {*} data
 * @property {boolean} loading
 * @property {Error} error
 */

/**
 * Custom hook for subscribing to changes in a store and returning the current value.
 *
 * @param {Store, Computed, Persistent, Fetched} store - The store object
 * @param {Array<string>|null} keys - Listen to these key changes (if the value is an object)
 * @returns {StoreResponse} The current value of the store
 */
export const useFetched = (store, keys = null) => {
  const [data, setData] = useState(store.get());
  const [loading, setLoading] = useState(store.loading);
  const [error, setError] = useState(store.error);

  useEffect(() => {
    const listener = store.listen((data) => setData(data), keys);
    store.catch((error) => setError(error));
    store.load((loading) => setLoading(loading));

    return () => {
      // Unsubscribe the listener
      listener.unsubscribe();

      // Unsubscribe other dependencies
      store.clear();
    };
  }, []);

  return { data, loading, error };
};
