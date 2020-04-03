

;(function ( $, window, document, undefined ) {

    var pluginName = 'squarespaceCarousel';

    function Plugin ( element, options ) {
        this.element = element;
        this._name = pluginName;
        this._defaults = $.fn.squarespaceCarousel.defaults;
        this.options = $.extend( {}, this._defaults, options );
        this.platform = navigator.userAgent.indexOf('Mobile') == -1 ? 'desktop' : 'mobile';
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            this.buildCache();
            this.slides = this.$element.find(this.options.slideSelector);
            console.log(this.slides);
            this.activeSlideIndex = 0;
            this.activeSlide = $(this.slides[this.activeSlideIndex]);
            this.fadeInSlide = true;
            console.log(this.activeSlide);
            this.loadSlide();
        },
        loadSlide: function() {
            var _this = this, callbackCalled = false;
            if(this.platform == 'desktop'){
                this.activeSlideImg = this.activeSlide.find('.home-carousel__slide__main-background.is-desktop img');
            }
            else{
                this.activeSlideImg = this.activeSlide.find('.home-carousel__slide__main-background.home-carousel__slide__main-background--mobile img');
            }
            console.log(this.activeSlideImg)
            if(this.activeSlideImg.attr('data-load') == 'false'){
                var image = new Image();
                image.onload = function() {
                    if(!callbackCalled){
                        _this.slideImageLoaded();
                        callbackCalled = true;
                    }
                };
                image.src = this.activeSlideImg.attr('data-bkg-src');
                setTimeout(function(){ if(image.complete || image.width + image.height > 0) { 
                    if(!callbackCalled){
                        _this.slideImageLoaded();
                        callbackCalled = true;
                    }
                } },5);
            }
            else{
                this.slideImageLoaded();
            }
        },
        slideImageLoaded: function() {
            var _this = this;
            this.activeSlideImg.attr('src', this.activeSlideImg.attr('data-bkg-src'));
            if(typeof this.previousActiveSlide != 'undefined'){
                if(this.previousActiveSlide.hasClass('active-slide')){
                    this.previousActiveSlide.removeClass('active-slide fade-in slide-in');
                }
            }
            if(this.fadeInSlide == true){
                this.activeSlide.addClass('active-slide fade-in');
                this.fadeInSlide = false;
            }
            else{
                this.activeSlide.addClass('active-slide slide-in');
            }
            setTimeout(function(){
                _this.activeSlide.addClass('show-text');
            }, this.options.textInterval);
            setTimeout(function(){
                _this.loadNextSlide();
            },this.options.slideInterval);
        },
        loadNextSlide: function(){

            if(typeof this.previousActiveSlide != 'undefined'){
                var _previousActiveSlide = this.previousActiveSlide;
                _previousActiveSlide.removeClass('previous-slide');
                _previousActiveSlide.removeClass('show-text');
            }
            this.previousActiveSlide = this.activeSlide;
            this.previousActiveSlide.addClass('previous-slide');
            if(typeof this.slides[this.activeSlideIndex+1] != 'undefined'){
                this.activeSlideIndex++;
            }
            else{
                this.activeSlideIndex = 0;
            }
            this.activeSlide = $(this.slides[this.activeSlideIndex]);
            this.loadSlide();
        },
        destroy: function() {
            this.$element.removeData();
        },
        buildCache: function () {
            this.$element = $(this.element);
        }
    });

    $.fn.squarespaceCarousel = function ( options ) {
        this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
        return this;
    };

    $.fn.squarespaceCarousel.defaults = {
        slideSelector: '.home-carousel__slide',
        slideInterval: 4000,
        textInterval: 750,
    };

    $('.home-carousel').squarespaceCarousel();

})( jQuery, window, document );