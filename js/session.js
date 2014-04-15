$(document).on("pagebeforeshow", "#session", function(e, data) {

    var session_id = store.p1;
    
    if (session_id === null) {
        $.mobile.navigate('#group');
    }

    $.getJSON(getApiCall('sessions/'+session_id, 'fields=name,starts_at,ends_at,content,event_id'), function(session) {
        
        // if (event.avatarPath != null) {
        //     $('.session-logo').attr('src', event.avatarPath);
        // } else {
        $('.session-logo').attr('src', "images/logo-campsite-GA.png");
        // }

        $('.session-title').html(session.name);
        $('.session-time').html(getDateRangeString(session.starts_at, session.ends_at)+'<br/>'+getTimeRangeString(session.starts_at, session.ends_at));

        if (session.content !== null){
            $('.session-description').html('<p>'+session.content+'</p>');
        }
        
        upButton.html('<a href="#event" class="ui-btn ui-icon-arrow-l ui-btn-icon-left" data-p1='+session.event_id+' data-direction="reverse">Event</a>');
    });

});