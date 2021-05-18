# Postgraphile Live Query

Optimized GraphQL live-queries for Postgraphile, using json-patches.

## Integration (install + usage)

### Server

1) Install: `yarn add @pg-lq/postgraphile-plugin` (or `npm install ...`)
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

1) Install: `yarn add @pg-lq/apollo-plugin` (or `npm install ...`)
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
2) Run: `yarn workspaces run install`