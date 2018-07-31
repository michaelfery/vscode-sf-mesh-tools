'use strict';
import { generatorProject } from '../yo';
import { createDeploymentProfile } from './create-deployment-profile';

export async function createApplication() {
    await generatorProject(false);
    await createDeploymentProfile('deploy/mesh.template.json', '');
}