'use strict';
import { generatorProject } from '../yo';
import { createDeploymentProfile } from './create-deployment-profile';
import * as terminals from "../utils/terminals";

export async function createApplication() {
    var success = await generatorProject(false);
    if (success === true)
    {
        await createDeploymentProfile('deploy/mesh.template.json', '');
    }
}

export async function listApps() {
    var terminal = terminals.getTerminal();
    terminal.show();
    terminal.sendText("az mesh app list -o table", true);
}