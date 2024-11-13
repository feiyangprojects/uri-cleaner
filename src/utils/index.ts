export function getRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    let string = "";
    array.forEach((i) => {
        string += i.toString(16).padStart(2, "0");
    });

    return string;
}

export function getUrl(url: string): string | null {
    // https://www.rfc-editor.org/rfc/rfc2396#appendix-B
    const matchedUrl = url.match(
        /((?:http|https):)(\/\/([^/?#]*))([^?#]*)(\?([^#]*))?(#(.*))?/,
    );
    if (matchedUrl !== null) {
        return matchedUrl[0];
    } else {
        return null;
    }
}
