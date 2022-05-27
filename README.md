# Honkit Holaspirit plugin

An Honkit book plugin to automatically convert roles notations into Holaspirit links.

## Usage

For any role you would like to convert to a Holaspirit link just rewrite it as:

```raw
{% role %}<circle name>/<role name>{% endrole %}
```

Where circle name is the parent circle for the role. As defined in your circles.

## Installation

```bash
npm i --save-dev honkit-plugin-holaspirit
```

Then add `holaspirit` inside `plugins` and `pluginsConfig` properties in your book.json, as shown below:

```json
{
	"plugins": [
		"holaspirit",
		//...other plugins
	],
	"pluginsConfig": {
		"holaspirit": {
			"token": "env://<ENV_VARIABLE_NAME_HERE>" //or "token://<YOUR_TOKEN_HERE>",
			"organizationId": "<YOUR_ORGANIZATION_ID_HERE>"
		},
		//...other plugins configs...
	}
	//...other configurations variables
}
```

Make sure to replace `token` and `organizationId` with the correct information:

- **organizationId** of your organization account in Holaspirit. This can be obtained by looking at Hasura URL when navigating the website. They are in the form: `https://app.holaspirit.com/o/<ORGANIZATION_ID>/governance/chart`
- **access token** must be requested to the Holaspirit support. This is a read-only access token to use Holaspirit APIs.

You can supply the token in two ways:

- by specifying the environment *variable name* to look for (e.g. `env://holaspirit_token`)
- from the configuration file itself (e.g. `token://abcdefGHI371s`)
