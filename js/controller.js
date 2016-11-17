snApp.controller("snCtrl", function($scope, requester)
{
    $scope.data = {};
    NProgress.start();
    var suspend = requester.suspend();

    $scope.testClick = function()
    {
        
        suspend.getTimeLeft(function(left)
        {
            console.log(left);
        });
    }

    $scope.model = 
    {
        first: 0
    }

    $scope.$watch('model.first', function(newValue) {
        var snoozeString = "";
        var val = newValue * 60000;
        suspend.start(val);     
        var hrs = Math.floor(Math.abs(newValue) / 60);
        var mins = Math.abs(newValue) % 60;

        if(hrs > 0)
            snoozeString = hrs +'hrs ';

        if(mins > 0)
            snoozeString += mins + 'min';

        console.log(snoozeString);

    });

    $scope.testOptions = {
            min: 0,
            max: 180,
            step: 5,
            precision: 0,
            orientation: 'horizontal',  // vertical
            handle: 'round', //'square', 'triangle' or 'custom'
            tooltip: 'show', //'hide','always'
            tooltipseparator: ':',
            tooltipsplit: false,
            enabled: true,
            naturalarrowkeys: false,
            range: false,
            ngDisabled: false,
            reversed: false
        };

    requester.request().then(function(data)
    {
        $scope.data = data;

        NProgress.set(1.0);
    })
    
})