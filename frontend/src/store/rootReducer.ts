import { combineReducers, Reducer, AnyAction } from "redux";
import auth, { AuthState } from "./slices/auth";
import RtkQueryService from "@/services/RtkQueryService";

// Define RootState without using CombinedState
export interface RootState {
  auth: AuthState;
  [RtkQueryService.reducerPath]: ReturnType<typeof RtkQueryService.reducer>;
}

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  auth,
  [RtkQueryService.reducerPath]: RtkQueryService.reducer,
};

const rootReducer =
  (asyncReducers?: AsyncReducers) => (state: RootState, action: AnyAction) => {
    const combinedReducer = combineReducers({
      ...staticReducers,
      ...asyncReducers,
    });
    return combinedReducer(state, action);
  };

export default rootReducer;
