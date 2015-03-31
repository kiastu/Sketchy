/*
 * Styles
*/

$(document).ready(function() {
        function adjustSize() {
            return function() {
                var menuContainer = $('.container');
                var canvasWrapper = $('.wrapper');

                // reset to 100%, so adjustment calculations do not break
                canvasWrapper.css('height', '100%');

                // adjust
                canvasWrapper.css('width', menuContainer.outerWidth(false));
                canvasWrapper.css('height', canvasWrapper.height() - menuContainer.height());
                canvasWrapper.css('margin-left', menuContainer.css('margin-left'));
            };
        };

        adjustSize()();

        $(window).resize(function() {
            adjustSize()();
        });
});