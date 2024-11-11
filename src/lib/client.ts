import Env from "@/env";
import axios from "axios";

const client = axios.create({
  baseURL: Env.apiUrl,
});

export default client;
