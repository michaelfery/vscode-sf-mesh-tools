'use strict';

export default class DeploymentProfile {
    SubscriptionId?: string;
    ResourceGroup?: string;
    ResourceGroupLocation?: string;
    TemplateUri?: string;
    TemplateFile?: string;
    Location?: string;
    InlineParameters?: JSON;
}