import { assert } from "console";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

type LocalRepository = {
    fullPath: string,
    remoteUrl: string,
}

export async function findAllRepositories(
    baseDir: string,
    depth = 1,
): Promise<LocalRepository[]> {
    assert(depth >= 1, `expected depth is greater than 1 but actual is ${depth}.`);

    assert(fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory(), `${baseDir} is not found or is not directory.`);

    return await findGitDir(baseDir, depth);
}

async function findGitDir(dir: string, depth: number): Promise<LocalRepository[]> {
    const fullPath = path.resolve(dir);
    const remoteUrl = await getRemoteUrl(dir);
    if (remoteUrl) {
        return [{ fullPath, remoteUrl }];
    }

    if (depth === 0) {
        return [];
    }
    const subPaths = fs.readdirSync(dir);
    const findAllGitDir = subPaths.map((p) => {
        const subdir = path.resolve(dir, p);
        if (fs.statSync(subdir).isDirectory()) {
            return findGitDir(subdir, depth - 1);
        }
        return null;
    });
    return (await Promise.all(findAllGitDir))
        .flatMap(el => el ?? []);
}

async function getRemoteUrl(dir: string): Promise<string | null> {

    const aliases = await getRemoteAliases(dir);
    const git = simpleGit(dir);

    if (aliases.includes("origin")) {
        return (await git.getConfig("remote.origin.url", "local")).value;
    } else if (aliases.length >= 1) {
        return (await git.getConfig(`remote.${aliases[0]}.url`, "local")).value;
    }
    return null;
}

async function getRemoteAliases(dir: string): Promise<string[]> {
    const git = simpleGit(dir);
    try {
        const remoteAliases = await git.remote(["show"]);
        if (typeof remoteAliases === "string" && remoteAliases != "") {
            return remoteAliases.split("\n");
        }
    } catch (_e) {
        // do nothing
    }
    return [];
}
