function getEnv(key: string): string | undefined {
    if (typeof Deno === "object") {
        return Deno.env.get(key)
    // @ts-expect-error preserve compatibility with Node.js 
    } else if (typeof process === "object") {
        // @ts-expect-error see L4
        return process.env[key]
    } else {
        return undefined
    }
}

export const BOT_TOKEN = getEnv("BOT_TOKEN");
export const DOMAIN = getEnv("DOMAIN")
export const PATH = getEnv("PATH")