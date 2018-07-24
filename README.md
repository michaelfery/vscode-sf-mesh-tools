# README

## Features

Deploy To Azure Service Fabric Mesh : 
* Use command **Service Fabric Mesh: Create Application** (the command creates the mesh template and deployment profile)
* Use command **Service Fabric Mesh: Generate deployment profile** (from template file or uri)
* Update the profile parameters (subscriptionId, resourceGroup, etc.)
* Use command **Service Fabric Mesh: Login**
* Use command **Service Fabric Mesh: Deploy To Azure** (the command creates the resource group if needed)
* Use command **Service Fabric Mesh: List the deployed applications**

## Configuration 
* Set config **sf-mesh-tools.defaultSubscriptionId** to fill deployment profile automatically
* Set config **sf-mesh-tools.defaultResourceGroup** to fill deployment profile automatically
* Set config **sf-mesh-tools.defaultTemplateUri** to fill deployment profile automatically
* Set config **sf-mesh-tools.defaultTemplateFile** to fill deployment profile automatically
* Set config **sf-mesh-tools.defaultParameters** to fill deployment profile automatically

## Changelog

See [CHANGELOG.md](CHANGELOG.md)