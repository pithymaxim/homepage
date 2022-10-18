jQuery(document).ready(function($){
	var images = ['jason_sunset','long_woods'];
	$('body').css({'background-image': 'url(images/' + images[Math.floor(Math.random() * images.length)] + '.jpg)'});
});