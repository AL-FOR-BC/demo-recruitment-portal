import { combineReducers } from "@reduxjs/toolkit";
import job, { JobsState } from "./jobSlice";
import profile, { ProfileState } from "./profileSlice";
import application, { ApplicationState } from "./applicationSlice";

const reducer = combineReducers({
  profile,
  job,
  application,
});

export type AppState = {
  job: JobsState;
  profile: ProfileState;
  application: ApplicationState;
};

export * from "./jobSlice";
export * from "./profileSlice";
export * from "./applicationSlice";

export default reducer;
