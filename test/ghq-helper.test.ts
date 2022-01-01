import { convertRemoteUrlToGhqPath } from "../src/ghq-helper";


test("convertRemoteUrlToGhqPath", () => {
    const cases = [
        { url: "https://github.com/oboenikui/ghq-migrate.git", expectPath: "github.com/oboenikui/ghq-migrate" },
        { url: "git@github.com:oboenikui/ghq-migrate.git", expectPath: "github.com/oboenikui/ghq-migrate" },
        { url: "ssh://git@github.com/oboenikui/ghq-migrate.git", expectPath: "github.com/oboenikui/ghq-migrate" },
    ]

    for (const { url, expectPath} of cases) {
        expect(convertRemoteUrlToGhqPath(url)).toBe(expectPath);
    }
})
