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
        const d = new Date();
        d.toLocaleTimeString();
        const time = d.toLocaleString();

        const result = `Version: ${version}
Branch: ${branch}
BuildTime: ${time}
${detail}`
        fs.writeFileSync(path.resolve(compiler.options.output.path, 'version.txt'), result)
        console.info('——————构建version.txt完成——————')
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
}
module.exports = VersionWebpackPlugin;