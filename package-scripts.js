const scripts = {};
module.exports.scripts = scripts;

const goPG = "cd Packages/postgraphile-plugin";
const goAP = "cd Packages/apollo-plugin";

Object.assign(scripts, {
	"pg-plugin": {
		dev: `${goPG} && snowpack build --watch`,
		devTS: `${goPG} && tsc --watch --declaration --emitDeclarationOnly --declarationDir Build/Types`,
		pub: {
			same: `${goPG} && npm publish`,
			patch: `${goPG} && npm version patch && npm publish`
		}
	},
	"ap-plugin": {
		dev: `${goAP} && snowpack build --watch`,
		devTS: `${goAP} && tsc --watch --declaration --emitDeclarationOnly --declarationDir Build/Types`,
		pub: {
			same: `${goAP} && npm publish`,
			patch: `${goAP} && npm version patch && npm publish`
		}
	},
	dev: `concurrently --kill-others --names pg,pgt,ap,apt "npm start pg-plugin.dev" "npm start pg-plugin.devTS" "npm start ap-plugin.dev" "npm start ap-plugin.devTS"`,
});