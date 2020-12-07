module.exports = {
    // pages: {
    //     index: 'src/index/main.js',
    //     capture: 'src/capture/main.js'
    // },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                publish: ['github']
            }
        }
    }
}
