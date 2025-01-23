import { LibsqlDialect } from "@libsql/kysely-libsql";
import { betterAuth } from "better-auth";
import { Data } from "effect";
const dialect = new LibsqlDialect({
    url: import.meta.env.VITE_TURSO_DATABASE_URL || "",
    authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN || "",
})
 
export const auth = betterAuth({
  database: {
    dialect,
    type: "sqlite"
  },
  emailAndPassword: {  
    enabled: true
},
});

export class AuthError extends Data.TaggedError("AuthError")<{
  failedReason: string
}> {}
