import { Context, Telegraf } from "telegraf";
import type { NarrowedContext } from "telegraf";
import type { Message, Update } from "telegraf/types";
import clean from "./cleaners/index.ts";
import * as consts from "./utils/consts.ts";
import * as utils from "./utils/index.ts";

async function handleCommand(ctx: Context) {
    await ctx.reply(
        "Hi, I can clean links from unnecessary search parameters and redirects, send me a link via this chat or inline query to start.",
    );
}

async function handleInline(
    ctx: NarrowedContext<Context<Update>, Update.InlineQueryUpdate>,
) {
    if (ctx.inlineQuery.query !== "") {
        const protocol = /^https?:\/\/.+/;
        let query = "";
        if (protocol.test(ctx.inlineQuery.query)) {
            query = ctx.inlineQuery.query;
        } else {
            query = `https://${ctx.inlineQuery.query}`;
        }

        try {
            const url = new URL(query);

            const newUrl = await clean(url);

            await ctx.answerInlineQuery(utils.createInlineQueryResult(
                "Link Processed",
                "Tap here for the processed link.",
                newUrl.toString(),
            ));
        } catch (_) {
            const description =
                "Unable to process this input, please check input or try again later.";

            await ctx.answerInlineQuery(utils.createInlineQueryResult(
                "Error",
                description,
                description,
            ));
        }
    } else {
        await ctx.answerInlineQuery(utils.createInlineQueryResult(
            "Input Link",
            "Example: https://example.org/?utm_source=google",
            "https://example.org/",
        ));
    }
}

async function handleMessage(
    ctx: NarrowedContext<Context<Update>, {
        message: Update.New & Update.NonChannel & Message.TextMessage;
        update_id: number;
    }>,
) {
    const protocol = /^https?:\/\/.+/;
    let text = "";
    if (protocol.test(ctx.text)) {
        text = ctx.text;
    } else {
        text = `https://${ctx.text}`;
    }

    try {
        const url = new URL(text);

        const newUrl = await clean(url);

        await ctx.reply(newUrl.toString());
    } catch (_) {
        await ctx.reply(
            "Unable to process this input, please check input or try again later.",
        );
    }
}

if (consts.BOT_TOKEN != undefined) {
    const bot = new Telegraf(consts.BOT_TOKEN);

    bot.command("start", handleCommand);
    bot.on("inline_query", handleInline);
    bot.on("text", handleMessage);

    bot.catch((error) => {
        if (
            error instanceof Error &&
            error.message ===
                "400: Bad Request: query is too old and response timeout expired or query ID is invalid"
        ) {
            console.warn(
                "WARN: Due to slow network, some input can't be processed in time.",
            );
        } else {
            throw error;
        }
    });

    if (consts.DOMAIN !== undefined && consts.PATH !== undefined) {
        await bot.launch({
            webhook: {
                domain: consts.DOMAIN,
                path: consts.PATH,
            },
        });
    } else {
        await bot.launch();
    }
}
