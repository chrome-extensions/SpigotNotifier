app.service("Notifications", function()
{
    console.log("Service Initialized");

    this.createNotification = function(title, message)
    {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "img/icon512.png",
            title: title,
            message: message
        });
    }
})