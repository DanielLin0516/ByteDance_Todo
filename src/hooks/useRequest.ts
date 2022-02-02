import { reactive, UnwrapRef, toRefs } from "vue";

interface ResProps<R> {
  loading: boolean;
  data: R | undefined;
  error: Error | undefined;
  // refresh: () => Promise<R>;
}

interface StateProps<T> {
  data: T | undefined;
  error: Error | null;
  loading: boolean;
}

const initState: StateProps<null> = {
  data: null,
  error: null,
  loading: false,
};

const useRequest = <T extends any, U = unknown>(
  request: (...args: U[]) => Promise<UnwrapRef<T>>,
  options: {
    onSuccess?: (data: UnwrapRef<T>) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  const state = reactive<StateProps<T>>(initState as StateProps<T>);
  const { onSuccess, onError } = options;
  const setSuccess = (data: UnwrapRef<T>) => {
    state.data = data;
    state.error = null;
    state.loading = false;
  };

  const setError = (error: UnwrapRef<Error>) => {
    state.error = error;
    state.loading = false;
  };

  const run = async (...arg: U[]) => {
    if (!state.loading) {
      state.loading = true;
    }
    return await request(...arg)
      .then((res) => {
        onSuccess && res && onSuccess(res);
        res && setSuccess(res);
        return Promise.resolve(res);
      })
      .catch((err) => {
        setError(err);
        onError && onError(err);
        return Promise.reject(err);
      });
  };

  return { run, ...toRefs(state) };
};

export { useRequest };
