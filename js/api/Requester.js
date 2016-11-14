/*
*   Requester Service. 
*   Deals with data processing and and Object building.
*/
var app = typeof snApp != "undefined" ? snApp : bgApp;

app.service('requester', function($q, Notifications) {

    var interval = undefined;
    
    this.startIntervals = function()
    {
        var self = this;

        interval = setInterval(function()
        {
            self.request().then(function(data)
            {
                var total = 0;
                //If this time total = 0 but previously something else... increment.

                if(data.alerts)
                {
                    total += data.alerts;
                    Notifications.createNotification("New Alert", data.user + ", you've got a new notification.");
                }

                if(data.messages)
                {
                    total += data.messages;
                    Notifications.createNotification("New Message", data.user + ", you've got a new message.");
                }

                chrome.browserAction.setBadgeText({
                    text: (total == 0) ? "" : total.toString()
                });

            })
        }, 3000);
    }

    this.request = function () {
        var defer = $q.defer();

        this.getSource(function(source)
        {
            defer.resolve(source);
        })

        if(app.name == "snApp")
            NProgress.set(0.9);

        return defer.promise;
    }

    this.getSource = function(callback)
    {
        var self = this;

        $.ajax({
            url: 'http://www.adriani6.co.uk/soon.html'
        }).success(function(data){
            self.processData(data, function(processed)
            {
                if(app.name == "snApp")
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
            
            if(app.name == "snApp")
            {

                extracted.posts = $(data).find("#content").find(".stats").text().split(":")[1].replace("\nRatings","").replace("\n","");
                extracted.rating = $(data).find("#content").find(".dark_postrating_positive").text();
                extracted.img = $(data).find("#content").find(".avatar").find("img").first().attr("src"); 
                NProgress.set(0.8);

            }

            callback(extracted);
        })
    }

    function CustomTimer(callback, delay)
    {

        var id, started, remaining = delay, running

        this.start = function() {
            running = true
            started = new Date()
            id = setTimeout(callback, remaining)
        }

        this.pause = function() {
            running = false
            clearTimeout(id)
            remaining -= new Date() - started
        }

        this.getTimeLeft = function() {
            if (running) {
                this.pause()
                this.start()
            }

            return remaining
        }

        this.getStateRunning = function() {
            return running
        }

        this.start()
    }

});