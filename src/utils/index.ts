import type { InlineQueryResult } from "telegraf/types";

export function getRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    let string = "";
    array.forEach((i) => {
        string += i.toString(16).padStart(2, "0");
    });

    return string;
}

export function createInlineQueryResult(
    title: string,
    description: string,
    message_text: string,
): InlineQueryResult[] {
    return [{
        type: "article",
        id: getRandomString(16),
        title: title,
        description: description,
        input_message_content: {
            message_text: message_text,
        },
    }];
}
