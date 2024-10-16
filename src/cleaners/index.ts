import { cleaner as b23tvCleaner, pattern as b23tvPattern } from "./b23tv.ts";
import {
    parameters as bilibiliParameters,
    pattern as bilibiliPattern,
} from "./bilibili.ts";
import {
    parameters as twitterParameters,
    pattern as twitterPattern,
} from "./twitter.ts";
import {
    cleaner as xhslinkcomCleaner,
    pattern as xhslinkcomPattern,
} from "./xhslinkcom.ts";
import {
    parameters as xiaohongshuParameters,
    pattern as xiaohongshuPattern,
} from "./xiaohongshu.ts";
import {
    parameters as youtubeParameters,
    pattern as youtubePattern,
} from "./youtube.ts";
import {
    cleaner as youtudotbeCleaner,
    pattern as youtudotbePattern,
} from "./youtudotbe.ts";

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
    sites: [
        {
            pattern: b23tvPattern,
            cleaner: b23tvCleaner,
            parameters: bilibiliParameters,
        },
        { pattern: bilibiliPattern, parameters: bilibiliParameters },
        { pattern: twitterPattern, parameters: twitterParameters },
        {
            pattern: xhslinkcomPattern,
            cleaner: xhslinkcomCleaner,
            parameters: xiaohongshuParameters,
        },
        { pattern: xiaohongshuPattern, parameters: xiaohongshuParameters },
        { pattern: youtubePattern, parameters: youtubeParameters },
        {
            pattern: youtudotbePattern,
            cleaner: youtudotbeCleaner,
            parameters: youtubeParameters,
        },
    ],
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
