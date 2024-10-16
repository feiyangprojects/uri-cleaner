import { pattern as b23tvPattern } from "./b23tv.ts";
import {
    parameters as bilibiliParameters,
    pattern as bilibiliPattern,
} from "./bilibili.ts";
import {
    parameters as commonParameters,
    secureCleaner as commonSecureCleaner,
} from "./common.ts";
import { pattern as tcoPattern } from "./tco.ts";
import {
    parameters as twitterParameters,
    pattern as twitterPattern,
} from "./twitter.ts";
import { pattern as xhslinkcomPattern } from "./xhslinkcom.ts";
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

type sites = (
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

const sites: sites = [
    {
        pattern: b23tvPattern,
        cleaner: commonSecureCleaner,
        parameters: bilibiliParameters,
    },
    { pattern: bilibiliPattern, parameters: bilibiliParameters },
    { pattern: tcoPattern, cleaner: commonSecureCleaner },
    { pattern: twitterPattern, parameters: twitterParameters },
    {
        pattern: xhslinkcomPattern,
        cleaner: commonSecureCleaner,
        parameters: xiaohongshuParameters,
    },
    { pattern: xiaohongshuPattern, parameters: xiaohongshuParameters },
    { pattern: youtubePattern, parameters: youtubeParameters },
    {
        pattern: youtudotbePattern,
        cleaner: youtudotbeCleaner,
        parameters: youtubeParameters,
    },
];

export default async function index(url: URL): Promise<URL> {
    let newUrl = url;

    for (const site of sites) {
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

    commonParameters.forEach((parameter) => {
        newUrl.searchParams.delete(parameter);
    });

    return newUrl;
}
