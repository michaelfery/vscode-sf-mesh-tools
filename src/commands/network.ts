'use strict';

import * as terminals from "../utils/terminals";

export async function listNetworks() {
    var terminal = terminals.getTerminal();
    terminal.show();
    terminal.sendText("az mesh network list -o table", true);
}