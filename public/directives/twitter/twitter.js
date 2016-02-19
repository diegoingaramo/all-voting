app.directive('twitter', [
    function() {
        return {
            link: function(scope, element, attr) {
                setTimeout(function() {
                        twttr.widgets.createHashtagButton(
                            'allvotingapp',
                            element[0],
                            function(el) {}, 
                            {
                                text: attr.text
                            }
                        );
                });
            }
        }
    }
]);