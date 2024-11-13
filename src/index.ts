import { Context, Telegraf } from "telegraf";
import type { NarrowedContext } from "telegraf";
import type { InlineQueryResult, Message, Update } from "telegraf/types";
import clean from "./cleaners/index.ts";
import * as consts from "./utils/consts.ts";
import * as utils from "./utils/index.ts";
export function createInlineQueryResult(
    title: string,
    description: string,
    message_text: string,
): InlineQueryResult[] {
    return [{
        type: "article",
        id: utils.getRandomString(16),
        title: title,
        description: description,
        input_message_content: {
            message_text: message_text,
        },
    }];
}

export async function createInlineQueryResultDemo(): Promise<InlineQueryResult[]> {
    const url = await clean(new URL(utils.getUrl(consts.MESSAGES.DEMO_DESCRIPTION)!))

    return createInlineQueryResult(
        consts.MESSAGES.DEMO_TITLE,
        consts.MESSAGES.DEMO_DESCRIPTION,
        url.toString(),
    );
}

export function createInlineQueryResultFailed(): InlineQueryResult[] {
    return createInlineQueryResult(
        consts.MESSAGES.FAILED_TITLE,
        consts.MESSAGES.FAILED_DESCRIPTION,
        consts.MESSAGES.FAILED_DESCRIPTION,
    );
}

export function createInlineQueryResultDone(
    url: string,
): InlineQueryResult[] {
    return createInlineQueryResult(
        consts.MESSAGES.DONE_TITLE,
        consts.MESSAGES.DONE_DESCRIPTION,
        url,
    );
}

async function handleCommand(ctx: Context) {
    await ctx.reply(consts.MESSAGES.START);
}

async function handleInline(
    ctx: NarrowedContext<Context<Update>, Update.InlineQueryUpdate>,
) {
    if (ctx.inlineQuery.query !== "") {
        const query = utils.getUrl(ctx.inlineQuery.query)
        if (query === null) {
            return await ctx.answerInlineQuery(createInlineQueryResultFailed())
        }

        try {
            const url = new URL(query);

            const newUrl = await clean(url);

            await ctx.answerInlineQuery(createInlineQueryResultDone(newUrl.toString()));
        } catch (_) {
            await ctx.answerInlineQuery(createInlineQueryResultFailed())
        }
    } else {
        await ctx.answerInlineQuery(await createInlineQueryResultDemo());
    }
}

async function handleMessage(
    ctx: NarrowedContext<Context<Update>, {
        message: Update.New & Update.NonChannel & Message.TextMessage;
        update_id: number;
    }>,
) {
    const text = utils.getUrl(ctx.text)
    if (text === null) {
        return await ctx.reply(consts.MESSAGES.FAILED_DESCRIPTION)
    }

    try {
        const url = new URL(text);

        const newUrl = await clean(url);

        await ctx.reply(newUrl.toString());
    } catch (_) {
        await ctx.reply(consts.MESSAGES.FAILED_DESCRIPTION);
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
