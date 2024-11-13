function getEnv(key: string): string | undefined {
    if (typeof Deno === "object") {
        return Deno.env.get(key)
    } else if (typeof process === "object") {
        return process.env[key]
    } else {
        return undefined
    }
}

export const BOT_TOKEN = getEnv("BOT_TOKEN");
export const DOMAIN = getEnv("DOMAIN")
export const PATH = getEnv("PATH")

export const MESSAGES = {
    DEMO_TITLE: "Input Link",
    DEMO_DESCRIPTION: "e.g. https://www.example.org/?utm_source=google",
    FAILED_TITLE: "Failed",
    FAILED_DESCRIPTION: "Unable to process this input, please check input or try again later.",
    DONE_TITLE: "Link Processed",
    DONE_DESCRIPTION: "Tap here for the processed link.",
    START: "Hi, I can clean links from unnecessary search parameters and redirects, send me a link via this chat or inline query to start."
}