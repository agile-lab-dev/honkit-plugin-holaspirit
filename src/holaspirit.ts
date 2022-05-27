import axios from 'axios';

/**
 * A HolaspiritClient which is able to retrieve circles and roles by providing a token and an organizationId
 * @author Manuel Scurti (manuel.scurti@agilelab.it)
 */
export class HolaspiritClient {
    private readonly organizationId: string;
    private readonly token: string;
    private readonly rolesEndpointUrl: string;
    private readonly circlesEndpointUrl: string;

  constructor(organizationId: string, token: string) {
    this.organizationId = organizationId;
    this.token = token;
    this.rolesEndpointUrl = new URL(`/api/organizations/${this.organizationId}/roles` ,`https://app.holaspirit.com`).href;
    this.circlesEndpointUrl = new URL(`/api/organizations/${this.organizationId}/circles` ,`https://app.holaspirit.com`).href;
  }

  /**
   * Get all roles within the given @circleId 
   * @param circleId
   * @returns map of (role name => role id)
   */
  async getRolesByCircleId(circleId: string): Promise<{ [x: string]: any; }> {
    const rolesResponse = await fetch(this.rolesEndpointUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}` 
        }
    })

    if (!rolesResponse.ok) {
        console.error(`Unable to retrieve roles for circleId: ${circleId}. Status code: ${rolesResponse.statusText}. Error: ${await rolesResponse.json()}`);
        return {}
    }

    return (await rolesResponse.json()).data.reduce((map: { [x: string]: any; }, role: { name: string; id: string; }) => {
        map[role.name] = role.id;
        return map;
    }, {})
  }

  /**
   * Get all circles defined by the organization
   * @returns map of (circle name => circle id)
   */
  async getCircles() {
    return axios
      .get(`${this.circlesEndpointUrl}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => {
        const circlesMap = new Map();
        res.data.data.forEach((circle) =>
          circlesMap.set(circle.name.toLowerCase(), circle.id)
        );
        return circlesMap;
      })
      .catch((err) => {
        console.log(err);
        return new Map();
      });
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
      console.log("circle not recognized");
      return "#";
    }

    // get roles for that circle
    const circleId = circlesMap.get(circleName);
    const rolesMap = await this.getRolesByCircleId(circleId);

    if (!rolesMap.has(roleName)) {
      console.log("role not recognized");
      return "#";
    }

    const roleId = rolesMap.get(roleName);

    // generate holaspirit link
    return `https://app.holaspirit.com/o/${this.organizationId}/governance/roles?roleId=${roleId}`;
  }
}
