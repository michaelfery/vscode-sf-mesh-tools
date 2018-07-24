'use strict';
import * as terminals from "../utils/terminals";

export async function login() {
    var terminal = terminals.getTerminal();
    terminal.show(true);
    terminal.sendText("az login", true);
}