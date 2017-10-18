require.config({
    baseUrl: '/javascripts',
    paths: {
        jquery: 'lib/jquery-3.2.1',
    },
    // 依赖
    shim: {
        // bootstrap: {
        //     deps: ['jquery'],
        //     exports: 'bootstrap'
        // },
    }
});

require(['header'], function(headerModule){
    var header = headerModule.header;
    var headerEntity = new header();
    headerEntity.customization.init();
})