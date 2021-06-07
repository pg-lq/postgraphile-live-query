# Postgraphile Live Query

Optimized GraphQL live-queries for Postgraphile, using json-patches.

## Prerequisites

1) The [subscription-lds](https://github.com/graphile/graphile-engine/tree/v4/packages/subscriptions-lds#installation) plugin should already be set up for your Postgraphile server.
2) You must be using Postgraphile v4.12.1 or newer. (the Postgraphile plugin requires the existence of a new hook, which was [added only recently](https://github.com/graphile/postgraphile/pull/1483))

## Integration (install + usage)

### Server

1) Install: `yarn add @pg-lq/postgraphile-plugin` (or `npm i @pg-lq/postgraphile-plugin`)
2) Integrate:
```diff
+import {GeneratePatchesPlugin} from "@pg-lq/postgraphile-plugin";

+const pluginHook = makePluginHook([GeneratePatchesPlugin]);
const postgraphileMiddleware = postgraphile(
	"DATABASE_URL,
	"SCHEMA_NAME",
	{
		appendPlugins: [
			require("@graphile-contrib/pg-simplify-inflector"),
			require("@graphile/subscriptions-lds").default,
		],
		live: true,
+		pluginHook,
		[...]
	},
)
```

### Client (Apollo)

1) Install: `yarn add @pg-lq/apollo-plugin` (or `npm i @pg-lq/apollo-plugin`)
2) Integrate:
```diff
+import {ApplyPatchesLink} from "@pg-lq/apollo-plugin";
const apolloClient = new ApolloClient({
-	link: link,
+	link: new ApplyPatchesLink(link),
	[...]
});
```

## Development

1) Download/clone this repo.
2) Run: `yarn`
3) Run: `npm start dev` (or ctrl+shift+b in vscode)