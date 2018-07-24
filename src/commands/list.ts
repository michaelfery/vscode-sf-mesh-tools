'use strict';
import * as terminals from "../utils/terminals";

export async function list() {
    var terminal = terminals.getTerminal();
    terminal.show();
    terminal.sendText("az mesh app list -o table", true);
}