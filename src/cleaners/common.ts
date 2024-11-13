export const parameters = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
];

export async function cleaner(url: URL, secure?: boolean): Promise<URL> {
    if (secure === true) {
        if (url.protocol === "http:") {
            url.protocol = "https:";
        }
    }

    const response = await fetch(url, { method: "HEAD", redirect: "manual" });
    const header = response.headers.get("location");

    if (header === null) {
        throw new TypeError("Failed to get header");
    }

    const newUrl = new URL(header);

    return newUrl;
}

export async function secureCleaner(url: URL): Promise<URL> {
    return await cleaner(url, true);
}
