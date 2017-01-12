const fs = require('fs')
const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const decaf = require('decaffeinate')

// npm install decaffeinate glob
const currentDirectory = path.join(__dirname, './**/*')
console.log(chalk.green('Directory:'), chalk.yellow(currentDirectory))

glob(currentDirectory, function( err, files ) {
    const failed = []

    files.forEach(file => {
        if (file.match(/node_modules/) || !file.match(/.(cjsx|coffee)$/)) {
            return
        }
        if (fs.statSync(file)) {
            const raw = fs.readFileSync(file, 'utf8')

            try {
                const output = decaf.convert(raw)
                fs.writeFileSync(file.replace(/\.(cjsx|coffee)/, '.js'), output.code)
                fs.unlink(file)
                console.log(chalk.green('+'), file)
            } catch(e) {
                console.log(chalk.red('-', file))
                console.error(chalk.red(e.message))
                failed.push(file)
            }
        }
    })

    if (failed.length) {
        console.log(chalk.red('FAILED FILES:\n'), failed.join('\n'))
    } else {
        console.log(chalk.green('All files were successfully converted!'))
    }
})
