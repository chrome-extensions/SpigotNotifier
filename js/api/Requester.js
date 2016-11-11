/*
*   Requester Service. 
*   Deals with data processing and and Object building.
*/
snApp.service('requester', function($q) {

    this.request = function () {
        var defer = $q.defer();

        this.getSource(function(source)
        {
            defer.resolve(source);
        })
        NProgress.set(0.9);
        return defer.promise;
    }

    this.getSource = function(callback)
    {
        var self = this;

        $.ajax({
            url: 'https://www.spigotmc.org'
        }).success(function(data){
            self.processData(data, function(processed)
            {
                NProgress.set(0.6);
                callback(processed);
            })
        })
    }

    this.processData = function(data, callback)
    {
        var extracted = {};

        $(data).find("#userBar").find(".accountUsername").each(function()
        {
            extracted.user = $(this).text();
        }).promise().done(function()
        {
            extracted.alerts = parseInt($(data).find("#AlertsMenu_Counter").text());
            extracted.messages = parseInt($(data).find("#ConversationsMenu_Counter").text());  
            extracted.posts = $(data).find("#content").find(".stats").text().split(":")[1].replace("\nRatings","").replace("\n","");
            extracted.rating = $(data).find("#content").find(".dark_postrating_positive").text();
            extracted.img = $(data).find("#content").find(".avatar").find("img").first().attr("src"); 
            NProgress.set(0.8);
            callback(extracted);
        })
    }

});