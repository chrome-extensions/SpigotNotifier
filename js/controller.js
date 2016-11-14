snApp.controller("snCtrl", function($scope, requester)
{
    $scope.data = {};
    NProgress.start();

    requester.request().then(function(data)
    {
        $scope.data = data;
        NProgress.set(1.0);
    })


})