type config = {
    common: string[];
    sites: (
        & {
            pattern: URLPattern;
            cleaner?: (url: URL) => Promise<URL>;
            parameters?: string[];
        }
        & ({
            cleaner: (url: URL) => Promise<URL>;
        } | {
            parameters: string[];
        })
    )[];
};

const config: config = {
    common: [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
    ],
    sites: [],
};

export default async function index(url: URL): Promise<URL> {
    let newUrl = url;

    for (const site of config.sites) {
        if (site.pattern.test(newUrl)) {
            if (site.cleaner !== undefined) {
                newUrl = await site.cleaner(newUrl);
            }
            if (site.parameters !== undefined) {
                site.parameters.forEach((parameter) => {
                    newUrl.searchParams.delete(parameter);
                });
            }
        }
    }

    config.common.forEach((parameter) => {
        newUrl.searchParams.delete(parameter);
    });

    return newUrl;
}
