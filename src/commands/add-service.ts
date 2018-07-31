'use strict';
import { generatorProject } from '../yo';
import { createDeploymentProfile } from './create-deployment-profile';

export async function addService() {
    await generatorProject(true);
    await createDeploymentProfile('deploy/mesh.template.json', '');
}