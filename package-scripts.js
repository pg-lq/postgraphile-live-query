const scripts = {};
module.exports.scripts = scripts;

const goPG = "cd Packages/postgraphile-plugin";
const goAP = "cd Packages/apollo-plugin";

Object.assign(scripts, {
	"pg-plugin": {
		dev: `${goPG} && tsc`,
		pub: {
			same: `${goPG} && npm publish`,
			patch: `${goPG} && npm version patch && npm publish`
		}
	},
	"ap-plugin": {
		dev: `${goAP} && tsc`,
		pub: {
			same: `${goAP} && npm publish`,
			patch: `${goAP} && npm version patch && npm publish`
		}
	},
	dev: `concurrently --kill-others --names pg,ap "npm start pg-plugin.dev" "npm start ap-plugin.dev"`,
});