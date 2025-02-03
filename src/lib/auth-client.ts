import { createAuthClient } from "better-auth/svelte"
export const authClient = createAuthClient({
  baseURL: window.location.origin // the base url of your auth server
})
