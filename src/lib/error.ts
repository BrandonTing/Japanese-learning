import { Data } from "effect";

export class AuthError extends Data.TaggedError("AuthError")<{
  failedReason: string
}> { }

export class AIGenerateError extends Data.TaggedError("AIGenerateError")<{
  failedReason: string
}> { }

export class PromptError extends Data.TaggedError("PromptError")<{}> { }

export class JSONParseError extends Data.TaggedError("JSONParseError")<{
  parseErrorMessage: string
}> { }

export class ParseError extends Data.TaggedError("ParseError")<{
  parseErrorMessage: string
}> { }

export type ErrorResposne = {
  success: false,
  message: string
}

export class DuplicatedError extends Data.TaggedError("DuplicatedError")<{}> { }