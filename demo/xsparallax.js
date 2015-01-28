(function ($) {
    'use strict';
    var defaults = {
            bgFolder: 'xspl-backgrounds',
            fileExtension: '.jpg',
            speed: 5,
            direction: 'vertical'
        },
        settings = {},
        layers,
        CSS3vendors = ['-moz-', '-webkit-', '-o-', '-ms-', '-khtml-', ''],
        utils = {
            setCSS3Style: function (el, prop, val) {
                el = $(el);
                $.each(CSS3vendors, function (i, vendor) {
                    var property = vendor + prop;
                    if (property in el[0].style) {
                        el.css(property, val);
                    }
                });
            }
        },
        prepareStage = function (self) {
            var windowW = $(window).width(),
                windowH = $(window).height();
            self.addClass('xspl-wrapper');
            if (self.find('.xspl-layer').length === 0) {
                layers = self.children().addClass('xspl-layer');
            } else {
                layers = self.find('.xspl-layer');
            }
            if (settings.direction === 'vertical') {
                layers.each(function () {
                    $(this).css({
                        'height': windowH
                    });
                });
            } else {
                self.addClass('horizontal').width(windowW * layers.length);
                layers.each(function () {
                    $(this).css({
                        'height': windowH,
                        'width': windowW
                    });
                });
            }
        },
        setBgImage = function () {
            var imgUrl = '';
            layers.each(function (index) {
                imgUrl = 'url(' + settings.bgFolder + '/' + 'xspl-bg-' + (index + 1) + settings.fileExtension + ')';
                $(this).css({
                    'background-image': imgUrl
                });
            });
        },
        scrolling = function () {
            if (settings.direction === 'vertical') {
                var _event = ('ontouchmove' in window) ? 'touchmove' : 'scroll',
                    distance;
                $(window).on(_event, function (e) {
                    $.each(layers, function (i, layer) {
                        layer = $(layer);
                        if (layer.offset().top < $(window).scrollTop()) {
                            distance = -($(window).scrollTop() - layer.offset().top) / 15;
                            layer.css({
                                'background-position': '50% ' + distance + 'px',
                            });
                            // utils.setCSS3Style(layer, 'transition', 'all 0.1s');
                        }
                    });
                });
            } else {
                var _event = ('ontouchmove' in window) ? 'touchmove' : 'scroll',
                    distance;
                $(window).on(_event, function (e) {
                    e.preventDefault();
                    $.each(layers, function (i, layer) {
                        layer = $(layer);
                        // if (layer.offset().top < $(window).scrollTop()) {
                        //     distance = -($(window).scrollTop() - layer.offset().top) / 15;
                        //     layer.css({
                        //         'background-position': distance + '% 0',
                        //     });
                        //     // utils.setCSS3Style(layer, 'transition', 'all 0.1s');
                        // }
                    });
                });
            }
        };
    $.fn.xsParallax = function (options) {
        settings = $.extend({}, defaults, options);

        prepareStage(this);
        setBgImage();
        scrolling();
        return this;
    };
}(jQuery));

$('#parallax').xsParallax({
    direction: 'vertical'
});