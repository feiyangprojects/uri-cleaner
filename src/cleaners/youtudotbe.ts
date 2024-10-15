export const pattern = new URLPattern(
    "http{s}?://youtu.be/*",
);

export async function cleaner(url: URL): Promise<URL> {
    const newUrl = new URL("https://www.youtube.com/watch");
    newUrl.searchParams.append("v", url.pathname.substring(1));

    return newUrl;
}
