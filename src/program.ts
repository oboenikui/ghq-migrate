import { Command } from "commander";
import fs from "fs";
import path from "path";
import { convertRemoteUrlToGhqPath, getGhqRootPath } from "./ghq-helper";
import { findAllRepositories } from "./repository-helper";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PKG = require("../package.json");

export function setupProgram(program: Command): Command {
    program.name(PKG.name)
        .description(PKG.description)
        .version(PKG.version)
        .arguments("<input> [output]")
        .option("-d, --depth <INTEGER>", "Depth to search directories", "1")
        .action(action)
    return program;
}

async function action(input: string, output: string | undefined, _option: Record<string, unknown>, command: Command) {

    const outputPath = output ?? getGhqRootPath();
    if (outputPath == null) {
        console.error("ghq command is not recognized. Is ghq installed?");
        return;
    }

    const depth = parseInt(command.getOptionValue("depth"));
    const repositories = await findAllRepositories(input, depth);
    for (const repository of repositories) {
        const newPath = path.join(outputPath, convertRemoteUrlToGhqPath(repository.remoteUrl));
        const parentDir = path.resolve(newPath, "../");
        fs.mkdirSync(parentDir, { recursive: true });

        try {
            fs.renameSync(repository.fullPath, newPath);
        } catch (e) {
            console.error(e);
        }
    }
}