export const pattern = new URLPattern("http{s}?://b23.tv/*");

export async function cleaner(url: URL): Promise<URL> {
    if (url.protocol === "http:") {
        url.protocol = "https:";
    }

    const response = await fetch(url, { redirect: "manual" });
    const header = response.headers.get("location");

    if (header === null) {
        throw new TypeError("Failed to get header");
    }

    const newUrl = new URL(header);

    return newUrl;
}
