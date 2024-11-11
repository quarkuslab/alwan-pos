import getEnvironmentVariable from "./utils/getEnvironmentVariable";

const Env = {
  apiUrl: getEnvironmentVariable("VITE_API_URL"),
};

export default Env;
