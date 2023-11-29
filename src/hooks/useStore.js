import { useState, useEffect } from "react";

export const useStore = (store) => {
  const [value, setValue] = useState(store.get());

  useEffect(() => {
    const listener = store.listen((value) => setValue(value));

    return () => listener.unsubscribe();
  }, []);

  return value;
};
