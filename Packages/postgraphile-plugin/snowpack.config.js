import {builtinModules} from "module";
import path from 'path';
const __dirname = path.join(path.dirname(decodeURI(new URL(import.meta.url).pathname))).replace(/^\\([A-Z]:\\)/, "$1");

const forProd = process.env.NODE_ENV == "production";

// config docs: https://www.snowpack.dev/reference/configuration
/** @type {import("snowpack").SnowpackUserConfig } */
//const config = {
module.exports = {
	exclude: [
		`./Build/**/*`,
		`./*.json`,
		`./*.js`
	].map(a => a.replace("./", __dirname.replace(/\\/g, "/") + "/")),
	workspaceRoot: process.env.NPM_LINK_ROOT, // needed so that same-version changes to linked-module files aren"t ignored (both for dev-server and prod-builds)
	plugins: [],
	packageOptions: {
		//external: require("module").builtinModules.concat(forProd ? ["react-vextensions", "react-vcomponents"] : []),
		knownEntrypoints: [
			// for packages that snowpack's auto-scanner misses // this seems to not work atm
			//"fast-json-patch",
			//"postgraphile/build/postgraphile/http/mapAsyncIterator".replace(/\//g, "\\"),
			//"iterall",
		],
		external: builtinModules.concat(
			"express", "postgraphile", "commander", "graphile-utils",
			"graphql",
			"@n1ru4l/graphql-live-query-patch",
			"iterall",
			"postgraphile/build/postgraphile/http/mapAsyncIterator",
			"postgraphile/build/postgraphile/http/mapAsyncIterator.js"
		),
	},
	devOptions: {
		open: "none",
	},
	buildOptions: {
		out: "Build/esm",
		sourcemap: true,
	},
};
//export default config;