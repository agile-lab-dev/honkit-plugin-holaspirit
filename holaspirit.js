const axios = require('axios')

/**
 * @author Manuel Scurti (manuel.scurti@agilelab.it)
 */
class HolaspiritClient {    
    constructor(organizationId, token) {
        this.organizationId = organizationId
        this.token = token
        this.baseUrl = `https://app.holaspirit.com`
        this.rolesEndpoint = `/api/organizations/${this.organizationId}/roles`
        this.circlesEndpoint = `/api/organizations/${this.organizationId}/circles`
    }

    /**
     * Get all roles within the @circleId specified 
     * @param circleId  
     * @returns map of (role name => role id)
     */
    async getRolesFilterByCircleId(circleId) {
        return axios.get(`${this.baseUrl}${this.rolesEndpoint}?circle=${circleId}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                }
            })
            .then(res => {
                const rolesMap = new Map()
                res.data.data.forEach(role => rolesMap.set(role.name.toLowerCase(), role.id))
                return rolesMap
            })
            .catch(err => {
                console.log(err)
                return new Map()
            })
    }

    /**
     * Get all circles defined by the organization
     * @returns map of (circle name => circle id)
     */
    async getCircles() {
        return axios.get(`${this.baseUrl}${this.circlesEndpoint}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                }
            })
            .then(res => {
                const circlesMap = new Map();
                res.data.data.forEach(circle => circlesMap.set(circle.name.toLowerCase(), circle.id))
                return circlesMap
            })
            .catch(err => {
                console.log(err)
                return new Map()
            })
    }

    /**
     * Generates an holaspirit url that points to the requested circle/role
     * 
     * @param circlesMap - all available circles for the organization 
     * @param circleName - name of the parent circle for the role
     * @param roleName - name of the role to obtain a link from
     * @returns string URL
     */
    async getRoleLink(circlesMap, circleName, roleName) {
        if (!circlesMap.has(circleName)) {
            console.log('circle not recognized')
            return '#'
        }
    
        // get roles for that circle
        const circleId = circlesMap.get(circleName)
        const rolesMap = await this.getRolesFilterByCircleId(circleId)
            
        if (!rolesMap.has(roleName)) {
            console.log('role not recognized')
            return '#'
        }
    
        const roleId = rolesMap.get(roleName)
    
        // generate holaspirit link
        return `https://app.holaspirit.com/o/${this.organizationId}/governance/roles?roleId=${roleId}`
    }
    
}

module.exports = HolaspiritClient