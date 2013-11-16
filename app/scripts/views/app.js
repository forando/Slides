define(['backbone', '../collections/slides', 'views/slides'], function(Backbone, SlidesCollection, SlidesView){
	var AppView = Backbone.View.extend({
		el: 'body',

		initialize: function(){
			var testCollection = [
				{title: 'My First Slide'},
				{title: 'My Second Slide'},
				{title: 'My Third Slide'}
			];
			new SlidesView({
				collection: new SlidesCollection(testCollection)
			});
		}
	});
	
	return AppView;
});