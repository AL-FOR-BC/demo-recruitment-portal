import { combineReducers } from "@reduxjs/toolkit";
import job, { JobsState } from "./jobSlice";
import profile, { ProfileState } from "./profileSlice";
import application, { ApplicationState } from "./applicationSlice";
import settings, { SettingsState } from "./settingsSlice";

const reducer = combineReducers({
  profile,
  job,
  application,
  settings,
});

export type AppState = {
  job: JobsState;
  profile: ProfileState;
  application: ApplicationState;
  settings: SettingsState;
};

export * from "./jobSlice";
export * from "./profileSlice";
export * from "./applicationSlice";
export * from "./settingsSlice";

export default reducer;
