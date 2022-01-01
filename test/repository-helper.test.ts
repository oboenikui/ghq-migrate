import { execSync } from "child_process";
import fs from "fs";
import { tmpdir } from "os";
import path from "path";
import { findAllRepositories } from "../src/repository-helper";

describe("findAllRepositories", () => {
    const repositoriesRoot = path.resolve(tmpdir(), "repository-helper");
    console.log(repositoriesRoot);
    beforeAll(() => {
        fs.mkdirSync(repositoriesRoot, { recursive: true });

        const repositories = [
            { path: "repoA", remote: [{ name: "origin", url: "https://example.com/user/repoA.git" }] },
            {
                path: "repoB",
                remote: [
                    { name: "origin", url: "git@example.com:user/repoB.git" },
                    { name: "origin1", url: "git@example.com:user1/repoB.git" },
                ]
            },
            { path: "repoC", remote: [{ name: "origin1", url: "ssh://git@example.com/user/repoC.git" }] },
            { path: "repoIgnored1", remote: [] },
            { path: "a/repoD", remote: [{ name: "origin", url: "https://example.com/user/repoD.git" }] },
            { path: "a/repoD/repoIgnored2", remote: [{ name: "origin", url: "https://example.com/user/repoIgnored2.git" }] },
            { path: "a/subdir/repoE", remote: [{ name: "origin", url: "https://example.com/user/repoE.git" }] },
        ];

        for (const repo of repositories) {
            const p = path.join(repositoriesRoot, repo.path);
            fs.mkdirSync(p, { recursive: true });
            execSync("git init", { cwd: p });
            for (const r of repo.remote) {
                execSync(`git remote add ${r.name} ${r.url}`, { cwd: p });
            }
        }
    })

    afterAll(() => {
        fs.rmSync(repositoriesRoot, { recursive: true });
    })

    test("depth 1", async () => {
        const result = await findAllRepositories(repositoriesRoot, 1);
        expect(result).toEqual(
            [
                { fullPath: `${repositoriesRoot}/repoA`, remoteUrl: "https://example.com/user/repoA.git" },
                { fullPath: `${repositoriesRoot}/repoB`, remoteUrl: "git@example.com:user/repoB.git" },
                { fullPath: `${repositoriesRoot}/repoC`, remoteUrl: "ssh://git@example.com/user/repoC.git" },
            ]
        )
    })

    test("depth 2", async () => {
        const result = await findAllRepositories(repositoriesRoot, 2);
        expect(result).toEqual(
            [
                { fullPath: `${repositoriesRoot}/a/repoD`, remoteUrl: "https://example.com/user/repoD.git" },
                { fullPath: `${repositoriesRoot}/repoA`, remoteUrl: "https://example.com/user/repoA.git" },
                { fullPath: `${repositoriesRoot}/repoB`, remoteUrl: "git@example.com:user/repoB.git" },
                { fullPath: `${repositoriesRoot}/repoC`, remoteUrl: "ssh://git@example.com/user/repoC.git" },
            ]
        )
    })

    test("depth 3", async () => {
        const result = await findAllRepositories(repositoriesRoot, 3);
        expect(result).toEqual(
            [
                { fullPath: `${repositoriesRoot}/a/repoD`, remoteUrl: "https://example.com/user/repoD.git" },
                { fullPath: `${repositoriesRoot}/a/subdir/repoE`, remoteUrl: "https://example.com/user/repoE.git" },
                { fullPath: `${repositoriesRoot}/repoA`, remoteUrl: "https://example.com/user/repoA.git" },
                { fullPath: `${repositoriesRoot}/repoB`, remoteUrl: "git@example.com:user/repoB.git" },
                { fullPath: `${repositoriesRoot}/repoC`, remoteUrl: "ssh://git@example.com/user/repoC.git" },
            ]
        )
    })
})
