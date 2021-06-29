import { createClient } from "nhost-js-sdk";

const config = {
  baseURL: process.env.REACT_APP_BACKEND_ENDPOINT,
  baseURL: "https://backend-9e2a9b0d.nhost.app",
};

const { auth, storage } = createClient(config);

export { auth, storage };