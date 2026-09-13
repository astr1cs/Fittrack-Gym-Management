import axios from 'axios'

export function createServerApi(token: string) {
  return axios.create({
    baseURL: process.env.API_URL,
    headers: { Cookie: `token=${token}` },
  })
}
