/*
*   Requester Service. 
*   Deals with data processing and and Object building.
*/
var app = typeof snApp != "undefined" ? snApp : bgApp;

app.service('requester', function($q, Notifications) {

    var interval = undefined;
    var alerts = 0, messages = 0;
    var suspend = false;
    
    this.startIntervals = function()
    {
        var self = this;

        interval = setInterval(function()
        {
            if(!suspend)
            {
                self.request().then(function(data)
                {
                    var total = 0;

                    if(data.alerts)
                    {
                        total += data.alerts;

                        if(data.alerts != alerts)
                        {
                            alerts = data.alerts;
                            var titleStr = data.alerts > 1 ? "New Alerts!" : "New Alert!";
                            var msgStr = data.alerts > 1 ? data.user + ", you've got "+data.alerts+" new notifications." : data.user + ", you've got a new notification.";
                            Notifications.createNotification(titleStr, msgStr);
                        }
                    }
                    else
                    {
                        alerts = 0;
                    }

                    if(data.messages)
                    {
                        total += data.messages;

                        if(data.messages != messages)
                        {
                            messages = data.messages;
                            var titleStr = data.messages > 1 ? "New Messages!" : "New Message!";
                            var msgStr = data.messages > 1 ? data.user + ", you've got "+data.messages+" you've got a new messages." : data.user + ", you've got a new message.";
                            Notifications.createNotification(titleStr, msgStr);
                        }
                    }
                    else
                    {
                        messages = 0;
                    }

                    chrome.browserAction.setBadgeText({
                        text: (total == 0) ? "" : total.toString()
                    });

                })
            }
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
            url: 'http://www.spigotmc.org'
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

    this.suspend = function()
    {
        var id, started, remaining, running;

        this.start = function(delay) {
            remaining = delay;
            var self = this;
            suspend = true;
            running = true;
            started = new Date();

            chrome.storage.sync.set({'suspend': {start: started.toString(), delay: delay}}, function() {
                // Notify that we saved.
                console.log('Settings saved');
            });

            id = setTimeout(function()
            {
                self.clear()
            }, remaining);
        }

        this.resume = function()
        {
            running = true;
            var self = this;
            id = setTimeout(function()
            {
                self.clear()
            }, remaining);
        }

        this.pause = function(cb) {
            chrome.storage.sync.get('suspend', function(res) {
                running = false
                clearTimeout(id)
                remaining -= new Date() - new Date(res.suspend.start);
                cb();
            });   
        }

        this.getTimeLeft = function(cb) {
            if (running) {
                var self = this;
                this.pause(function()
                {
                    self.resume();
                    cb(remaining);
                })   
            }
            else
                return "Not Running";
        }


        this.clear = function()
        {
            remaining = 0;
            running = false;
            clearTimeout(id);
            suspend = false;
            id = undefined;
        }

        return this;
    }
});