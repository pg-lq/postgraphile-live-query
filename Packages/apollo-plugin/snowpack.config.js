const forProd = process.env.NODE_ENV == "production";

// config docs: https://www.snowpack.dev/reference/configuration
/** @type {import("snowpack").SnowpackUserConfig } */
//export default {
module.exports = {
	exclude: [
		`./Build/**/*`,
		`./*.json`,
		`./*.js`
	].map(a => a.replace("./", __dirname.replace(/\\/g, "/") + "/")),
	workspaceRoot: process.env.NPM_LINK_ROOT, // needed so that same-version changes to linked-module files aren't ignored (both for dev-server and prod-builds)
	plugins: [],
	packageOptions: {
		//external: forProd ? ['react-vextensions', 'react-vcomponents'] : []
	},
	devOptions: {
		open: "none",
	},
	buildOptions: {
		out: "Build/ESM",
		sourcemap: true,
	},
};