const scripts = {};
module.exports.scripts = scripts;

Object.assign(scripts, {
	"pg-plugin": {
		dev: "cd Packages/postgraphile-plugin && snowpack build --watch",
		devTS: "cd Packages/postgraphile-plugin && tsc --watch --declaration --emitDeclarationOnly --declarationDir Build/Types",
	},
	"ap-plugin": {
		dev: "cd Packages/apollo-plugin && snowpack build --watch",
		devTS: "cd Packages/apollo-plugin && tsc --watch --declaration --emitDeclarationOnly --declarationDir Build/Types",
	},
	dev: `concurrently --kill-others --names pg,pgt,ap,apt "npm start pg-plugin.dev" "npm start pg-plugin.devTS" "npm start ap-plugin.dev" "npm start ap-plugin.devTS"`,
});