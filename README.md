# Postgraphile Live Query

Optimized GraphQL live-queries for Postgraphile, using json-patches.

## Prerequisites

1) The [subscription-lds](https://github.com/graphile/graphile-engine/tree/v4/packages/subscriptions-lds#installation) plugin should already be set up for your Postgraphile server.
2) You must be using Postgraphile v4.12.1 or newer. (the Postgraphile plugin requires the existence of a new hook, which was [added only recently](https://github.com/graphile/postgraphile/pull/1483))

## Integration

### Server-side

1) Install: `yarn add @pg-lq/postgraphile-plugin` (or `npm i @pg-lq/postgraphile-plugin`)
2) Integrate:
```diff
+import {GeneratePatchesPlugin} from "@pg-lq/postgraphile-plugin";

+const pluginHook = makePluginHook([new GeneratePatchesPlugin({...options})]);
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

### Client-side (Apollo)

1) Install: `yarn add @pg-lq/apollo-plugin` (or `npm i @pg-lq/apollo-plugin`)
2) Integrate:
```diff
+import {ApplyPatchesLink} from "@pg-lq/apollo-plugin";
const apolloClient = new ApolloClient({
-	link: link,
+	link: new ApplyPatchesLink({baseLink: link, ...options}),
	[...]
});
```

## Options

### GeneratePatchesPlugin

#### `generatePatchFunc: (previous, current)=>Patch`

```ts
new GeneratePatchesPlugin({
	// uses the patcher lib that graphql-live-query-patch defaults to (currently fast-json-patch)
	generatePatchFunc: null,

	// uses json-diff-patch (recommended; baseline)
	generatePatchFunc: CreateGeneratePatchFunc_JSONDiffPatch({
		// see here for list of options: https://github.com/benjamine/jsondiffpatch#options
		// note that our wrapper defaults these to support efficient array-item reordering
	}),

	// uses fast-json-patch
	// PRO: json-patches are more readable (at expense of slightly longer length in some cases)
	// CON: no special handling of array-item reordering/deletion (so can be very inefficient for that)
	generatePatchFunc: CreateGeneratePatchFunc_FastJSONPatch(),
})
```

### ApplyPatchesLink

#### `applyPatchFunc: (previous, patch)=>Object`

> See [generatePatchFunc](#generatepatchfunc-previous-currentpatch) section for patch-func options, and their tradeoffs. (replacing `CreateGeneratePatchFunc_` with `CreateApplyPatchFunc_`)

## Development

1) Download/clone this repo.
2) Run: `yarn`
3) Run: `npm start dev` (or ctrl+shift+b in vscode)

## Troubleshooting

1) If you're on NodeJS 14.13.0+, you may get an error (when using NodeJS to run server code that uses the `@pg-lq/postgraphile-plugin` package) about the named-import `compare` not being found in `fast-json-patch`. This is due to an issue in the `package.json` file of `fast-json-patch`.

See here for more details (and the fix): https://github.com/Starcounter-Jack/JSON-Patch/issues/277

2) You may get a Typescript error "Cannot find namespace 'JSX'." for `types.d.ts` in apollo-client. If hit, just replace the `JSX.Element` with `any` for now. (not sure when it started)