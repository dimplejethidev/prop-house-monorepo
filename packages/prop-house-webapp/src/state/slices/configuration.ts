import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigurationSlice {
  etherscanHost: string;
  backendHost: string;
  displayAdmin: boolean;
}

export enum BackendHost {
  Local = 'local',
  Dev = 'development',
  Prod = 'production',
}

const backendHostURI = (b: BackendHost) => {
  const localhost = 'http://localhost:3000';
  switch (b) {
    case BackendHost.Local:
      return localhost;
    case BackendHost.Dev:
      return process.env.REACT_APP_DEV_BACKEND_URI
        ? process.env.REACT_APP_DEV_BACKEND_URI
        : localhost;
    case BackendHost.Prod:
      return process.env.REACT_APP_PROD_BACKEND_URI
        ? process.env.REACT_APP_PROD_BACKEND_URI
        : localhost;
  }
};

const envToUri = (env: BackendHost | undefined) => {
  const devEnv = localStorage.getItem('devEnv');

  if ((!env || env === BackendHost.Dev) && devEnv) return backendHostURI(devEnv as BackendHost); // localhost && dev set env
  if (!env) return backendHostURI(BackendHost.Local); // localhost

  return backendHostURI(env as BackendHost); // development | prod environments
};

const initialState: ConfigurationSlice = {
  etherscanHost: 'https://etherscan.io',
  backendHost: envToUri(process.env.REACT_APP_NODE_ENV as BackendHost),
  displayAdmin: process.env.REACT_APP_NODE_ENV !== BackendHost.Prod,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setDisplayAdmin: (state, action: PayloadAction<boolean>) => {
      state.displayAdmin = action.payload;
    },
    toggleDisplayAdmin: (state, action: PayloadAction<void>) => {
      state.displayAdmin = !state.displayAdmin;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDisplayAdmin, toggleDisplayAdmin } = configSlice.actions;

export default configSlice.reducer;
