import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.0.81:8000",
});

export default client;
