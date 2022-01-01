# GHQ migrate

## DESCRIPTION

Migrate multiple local repositories cloned to a specific directory into a [ghq](https://github.com/x-motemen/ghq)-style directory structure.

## REQUIREMENTS

- yarn
- Node.js
- ghq

## BUILD

```bash
yarn install
yarn build
```

## RUN

```bash
bin/ghq-migrate <source path> [destination path]
```

## EXAMPLE

For example, local repositories are stored in the following structure.

### Before

```text
$HOME/git
|- repo1 (https://foo.example/user1/repo1.git)
|- repo2 (https://bar.example/user2/repo2.git)
|- repo3 (https://bar.example/user2/repo3.git)
:
```

### Run

```bash
bin/ghq-migrate ~/git
```

### After

```text
$HOME/ghq (ghq root path)
|- foo.example
|  |- user1
|     |- repo1 (https://foo.example/user1/repo1.git)
|- bar.example
|  |- user2
|     |- repo2 (https://bar.example/user2/repo2.git)
|     |- repo3 (https://bar.example/user2/repo2.git)
:
```
