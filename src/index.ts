import { program } from "commander";
import { setupProgram } from "./program";

setupProgram(program)
    .parse(process.argv);