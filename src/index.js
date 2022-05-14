const exec = require('child_process').exec;
const fs = require('fs')
const path = require('path')
class VersionWebpackPlugin {
    constructor (options = {}) {
        this.options = Object.assign(options);
        this.pluginName = 'Version-Webpack-Plugin'
    }
    apply (compiler) {
        const isProd = compiler.options.mode === 'production' || process.env.NODE_ENV === 'production';
        if (!isProd) return;

        compiler.hooks.done.tap(this.pluginName, () => {
            this.fetchVersionInfo(compiler)
        })
    }
    async fetchVersionInfo (compiler) {
        const commitId = await this.fetchCommitInfo('git rev-parse --short HEAD')
        const branch = await this.fetchCommitInfo('git symbolic-ref --short -q HEAD')
        const detail = await this.fetchCommitInfo(`git show ${commitId} --quiet`)
        const version = require(path.resolve(compiler.context, 'package.json')).version
        const time = this.getTime();

        const result = `Version: ${version}
Branch: ${branch}
BuildTime: ${time}
${detail}`
        fs.writeFileSync(path.resolve(compiler.options.output.path, 'version.txt'), result)
    }
    fetchCommitInfo (command) {
        return new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    resolve('');
                } else {
                    resolve(stdout.replace(/^[\s\n\r]+|[\s\n\r]+$/, ''))
                }
            })
        })
    }
    getTime () {
        const az = d => d < 10 ? `0${d}` : d;
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const h = date.getHours();
        const min = date.getMinutes();
        const s = date.getSeconds();

        return `${y}-${az(m)}-${az(d)} ${az(h)}:${az(min)}:${az(s)}`;
    }
}
module.exports = VersionWebpackPlugin;