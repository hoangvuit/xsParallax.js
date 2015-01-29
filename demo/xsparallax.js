(function ($) {
    'use strict';
    var defaults = {
            bgFolder: 'xspl-backgrounds',
            fileExtension: '.jpg',
            speed: 5,
            offset: 100,
            /* distance where the layer start scrolling*/
            direction: 'vertical'
        },
        settings = {},
        windowW, windowH,
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
            var layers;
            windowW = $(window).width();
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
                layers.each(function () {
                    $(this).css({
                        'height': windowH,
                        'width': windowW
                    });
                });

                var rebuiltHTML = '<div class="scroll-stage">' + self.html() + '</div>';
                self.html(rebuiltHTML);
                self.addClass('horizontal').find('.scroll-stage').css({
                    'width': windowW * layers.length,
                    'height': windowH
                });
            }
        },
        setBgImage = function () {
            var imgUrl = '',
                layers = $('.xspl-layer');
            layers.each(function (index) {
                imgUrl = settings.bgFolder + '/' + 'xspl-bg-' + (index + 1) + settings.fileExtension;
                if ('ontouchmove' in window) {
                    $(this).html('<img src="' + imgUrl + '" />').css('z-index', index);
                    // $(this).find('img').width(windowH * 2);
                } else {
                    $(this).css({
                        'background-image': 'url(' + imgUrl + ')'
                    });
                }
            });
        },
        scrolling = function (self) {
            var layers = self.find('.xspl-layer');
            if (settings.direction === 'vertical') {
                // if on touch device
                if ('ontouchmove' in window) {
                    var images = layers.find('img');
                    $(window).on('touchmove scroll', function (e) {
                        $.each(layers, function (i, layer) {
                            layer = $(layer);
                            layer.find('img').css({
                                'top': (layer.offset().top - $(window).scrollTop()) / 50
                            });
                        });
                    });
                } else {
                    $(window).on('scroll', function (e) {
                        $.each(layers, function (i, layer) {
                            layer = $(layer);
                            if (layer.offset().top < $(window).scrollTop() + settings.offset) {
                                distance = -($(window).scrollTop() - layer.offset().top) / (20 - settings.speed);
                                layer.css({
                                    'background-position': '50% ' + distance + 'px',
                                });
                            }
                        });
                    });
                    $(function () {
                        $.srSmoothscroll();
                    });
                }
            } else {
                var scrollStage = self.find('.scroll-stage'),
                    duration = 500,
                    scrollFactor = 10,
                    bgScrollFactor = 10,
                    distance = 0,
                    bgDistance = 0,
                    timerId, currentLayer = 0;
                $(window).on('mousewheel', function (event) {
                    clearTimeout(timerId);
                    if ((currentLayer === 0) && (event.deltaY > 0)) {
                        return;
                    }
                    if ((Math.abs(currentLayer) === layers.length - 1) && (event.deltaY < 0)) {
                        return;
                    }
                    timerId = setTimeout(function () {
                        distance += event.deltaY * windowW;
                        currentLayer += event.deltaY;
                        scrollStage.css({
                            'margin-left': distance
                        });
                        var index = Math.abs(currentLayer) - 1,
                            layer = layers.get(index),
                            currentBgPos = $(layer).css('background-position').split(' ')[0].replace('%', '');
                        bgDistance = 50 - ((currentLayer + 1) * bgScrollFactor);
                        layers.css('background-position', bgDistance + '% 0');
                    }, 100);
                });
            }
        };
    $.fn.xsParallax = function (options) {
        settings = $.extend({}, defaults, options);

        prepareStage(this);
        setBgImage();
        scrolling(this);
        return this;
    };
}(jQuery));

$('#parallax').xsParallax({
    direction: 'vertical',
    speed: 5,
    offset: 0
});