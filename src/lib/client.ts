import axios from 'axios'

const client = axios.create({
  baseURL: __API_URL__
})

export default client