bgApp.controller("bgController", function($scope, requester, Notifications)
{
    console.log("Background Task Started");

    requester.startIntervals();
})