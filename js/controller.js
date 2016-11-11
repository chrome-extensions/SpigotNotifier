snApp.controller("snCtrl", function($scope, requester)
{
    $scope.data = {};
    NProgress.start();
    $scope.data = "Hello";

    requester.request().then(function(data)
    {
        $scope.data = data;
        NProgress.set(1.0);
    })


})