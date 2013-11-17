define(['backbone', 'views/slide'], function(Backbone, SlideView){
    var SlidesView = Backbone.View.extend({
        //referensing the element withing the DOM
        el: $('.slides'),

        initialize: function(){
            this.currentSlideIndex = 1;
            this.numSlides = this.collection.length;
            this.transitionSpeed = 400;

            this.renderAll();

            App.Vent.on('init', this.hideAllButFirst, this);
            App.Vent.on('changeSlide', this.changeSlide, this);
        },

        renderAll: function(){
            this.$el.empty();
            this.collection.each(this.render, this);

        },

        hideAllButFirst: function(){
            this.$el.children(':nth-child(n+2)').hide();
        },

        changeSlide: function(opts){

            var self = this;
            var slides = this.$el.children();

            this.setCurrentSlideIndex(opts);

            var newSlide = this.getNextSlide(slides);

            this.animateToNewSlide(slides, newSlide, opts.direction);

            //Updating URI
            App.router.navigate('/slides/' + this.currentSlideIndex);

        },

        setCurrentSlideIndex: function(opts){

            if (opts.slideIndex) {
                return this.currentSlideIndex = ~~opts.slideIndex;
            }


            this.currentSlideIndex += opts.direction == 'next' ? 1 : -1;
            
            if (this.currentSlideIndex > this.numSlides) {
                return this.currentSlideIndex = 1;
            }

            if (this.currentSlideIndex <= 0) {
                return this.currentSlideIndex = this.numSlides;
            }
        },

        getNextSlide: function(slides){
            return slides.eq(this.currentSlideIndex - 1);
        },

        animateToNewSlide: function(slides, newSlide, direction){
            
            slides.filter(':visible')
                .animate({
                   top: direction == 'next' ? '100%' : '-100%',
                   opacity: 'hide'
                }, self.transitionSpeed, function(){
                    //slide is gone from view
                    $(this).css('top', 0);
                    newSlide
                        .css('top', direction == 'next' ? '-100%' : '100%')
                        .animate({
                            top: 0,
                            opacity: 'show'
                        }, self.transitionSpeed)
                });
        },

        render: function(slide){

            var slideView = new SlideView({model: slide});
            this.$el.append(slideView.render().el);

            return this;
        }
    });
    
    return SlidesView;
});