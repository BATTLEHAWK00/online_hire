import yaml from './yamlUtil'
import path from "path";
import fs from 'fs'

const defaultConfigFileName = 'config.yaml'

let GlobalConfiguration: MainConfig | null = null
let configFilePath: string | null = null

interface MainConfig {
    system: {
        displayName: string,
    },
    server: {
        port: string,
        address?: string,
    }
    modules: Record<string, ModuleConfig>
}

export interface ModuleConfig {

}

function updateModuleConfig(configName: string, configObj: ModuleConfig) {
    if (!GlobalConfiguration || !configFilePath) throw Error()
    GlobalConfiguration.modules[configName] = configObj
    yaml.save(GlobalConfiguration, configFilePath)
}

function loadConfig() {
    if (!configFilePath) throw Error()
    const config = yaml.load(configFilePath)
    GlobalConfiguration = <MainConfig>config
}

function getModuleConfig(moduleName: string) {
    if (!GlobalConfiguration) throw Error()
    return GlobalConfiguration['modules'][moduleName]
}

function getGlobalConfig() {
    if (!GlobalConfiguration) throw Error()
    return GlobalConfiguration
}

function moduleConfigExists(moduleName: string) {
    if (!GlobalConfiguration) throw Error()
    return !!GlobalConfiguration['modules'][moduleName]
}

export function Init() {
    console.log('Loading config...')
    configFilePath = process.env.config || path.join(process.cwd(), defaultConfigFileName)
    if (!fs.existsSync(configFilePath)) {
        yaml.save(DefaultConfiguration, configFilePath)
    }
    loadConfig()
}

const DefaultConfiguration: MainConfig = {
    system: {
        displayName: '网上招聘系统'
    },
    server: {
        port: '3000',
    },
    modules: {}
}

export default {
    updateModuleConfig,
    getModuleConfig,
    moduleConfigExists,
    getGlobalConfig
}