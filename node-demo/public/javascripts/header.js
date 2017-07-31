define(['jquery'], function ($) {

    function header() {
        this.name = 'header';
    }

    header.prototype.customization = {

        init: function () {
            this.methods();
        },
        methods: function () {
            
            $('#header-nav li').bind('click', function (e) {
                var e = e || e.event;
                $(this).parent().addClass('active').siblings().removeClass('active');
            });
            
        }

    }

    return {
        header: header
    }


});

