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

Then add 'holaspirit' keyword inside the list of plugins in book.json
```json
{
	"plugins": [
		"holaspirit",
		//...other plugins
	],
```

## Configuration

This plugin requires two fields to be filled:
- **organizationId** of your organization account in Holaspirit. 
- **access token** that is a read-only access token to use Holaspirit APIs

**organizationId** can be obtained from the URL, since Holaspirit links have this format:
```
https://app.holaspirit.com/o/<ORGANIZATION_ID>/governance/chart
```

while **access token** must be requested to the Holaspirit support.

When you have both fields you can add the holaspirit plugin configuration under pluginsConfig in *book.json* as shown below:

```json
	"pluginsConfig": {
		"holaspirit": {
			"token": "env://<ENV_VARIABLE_NAME_HERE>" //or "token://<YOUR_TOKEN_HERE>",
			"organizationId": "<YOUR_ORGANIZATION_ID_HERE>" 
		},
        //...other plugins configs...
    }
```

You can supply the token in two ways: 
- by specifying the environment variable name to look for (e.g. *env://holaspirit_token*)
- from the configuration file itself (e.g. *token://abcdefGHI371s*)



