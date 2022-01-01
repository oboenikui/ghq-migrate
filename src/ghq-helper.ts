import { execSync } from "child_process";
import path from "path";

export function convertRemoteUrlToGhqPath(urlString: string): string {
    let fixedUrl = urlString;

    if (fixedUrl.startsWith("git@")) {
        fixedUrl = fixedUrl.replace(/(^git@[^:]+):/, "ssh://$1/");
    }
    const url = new URL(fixedUrl);
    const pathname = url.pathname.replace(/.git$/, "");
    return path.join(url.host, pathname);
}

export function getGhqRootPath(): string | undefined {
    try {
        return execSync("ghq root").toString().trim();
    } catch (e) {
        console.error(e);
        return undefined;
    }
}