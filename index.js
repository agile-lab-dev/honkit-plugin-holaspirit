const HolaspiritClient = require('./holaspirit')
const dotenv = require('dotenv')

dotenv.config()

function isValidRoleBlock(roleBlock) {
    if (typeof roleBlock !== 'string') return false
    
    // roleBlock must contain at least a role and its direct parent-circle
    if (roleBlock.split('/').length <= 1) return false

    return true
}

function parseRoleBlock(roleBlock) {
    let splittedRoleBlock = roleBlock.split('/')

    let parentCircleName = splittedRoleBlock[splittedRoleBlock.length - 2].toLowerCase()
    let roleName = splittedRoleBlock[splittedRoleBlock.length - 1].toLowerCase()

    return {
        circleName: parentCircleName,
        roleName
    }
}

var holaspirit = null
var circlesMap = new Map()

module.exports = {
    "hooks": {
        "init": async function() {
            const organizationId = this.config.get('pluginsConfig.holaspirit.organizationId');
            if (!organizationId) {
                console.warn('No organizationId defined for Holaspirit')
                return
            }

            var token = this.config.get('pluginsConfig.holaspirit.token');
            if (!token) {
                console.warn('No token found for Holaspirit')
                return
            }

            if (token.startsWith('env://')) {
                const envVariableName = token.substring(6) 
                token = process.env[envVariableName]
            } else if (token.startsWith('token://')) {
                token = token.substring(8)
            } else {
                console.warn('Unable to parse Holaspirit Token')
                return
            }

            holaspirit = new HolaspiritClient(organizationId, token)
            circlesMap = await holaspirit.getCircles()
        }
    },
    "blocks": {
        role: {
            process: async function(block) {
                if (holaspirit === null) return block.body
                if (!isValidRoleBlock(block.body)) return block.body
                
                const parsedRoleBlock = parseRoleBlock(block.body)
                const link = await holaspirit.getRoleLink(circlesMap, parsedRoleBlock.circleName, parsedRoleBlock.roleName)
                 
                return `<a href="${link}" target="_blank">${block.body}</a>`;
            }
        }
    }
};