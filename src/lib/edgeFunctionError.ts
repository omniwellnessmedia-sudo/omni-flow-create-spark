/**
 * supabase.functions.invoke() throws a generic FunctionsHttpError on any non-2xx
 * response — its `.message` is always the fixed string "Edge Function returned a
 * non-2xx status code", never the function's own { error: "..." } body. The real
 * reason lives on `error.context`, the raw Response, and nothing reads it by
 * default. This reads it, so callers can show the actual failure instead of that
 * generic wrapper text.
 */
export async function describeFunctionError(error: unknown): Promise<string> {
  const err = error as { message?: string; context?: Response } | null;
  const context = err?.context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.clone().json();
      if (body?.error) return String(body.error);
    } catch {
      // Response body wasn't JSON — fall through to the generic message.
    }
  }
  return String(err?.message || "please try again.");
}
