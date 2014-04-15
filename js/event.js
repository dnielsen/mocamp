// Clear out all the data when you leave the page
$(document).on("pagebeforehide", "#event", function(e, data) {

    eventScheduleDiv.hide();
    eventScheduleList.empty();

    eventUnscheduledDiv.hide();
    eventUnscheduledList.empty();

    eventEntrySetList.empty();
    eventEntrySetDiv.hide();
});

$(document).on("pagebeforeshow", "#event", function(e, data) {

    var event_id = store.p1;

    if (event_id === null) {
        $.mobile.navigate('#group');
    }
    
    $.getJSON(getApiCall('events/'+event_id, 'fields=id,name,content,starts_at,ends_at,location,address1,address2,group_id,entrySetRegistration_id'), function(event) {

        $.getJSON(getApiCall('sessions', 'event_id='+event_id+'&sort_by=-starts_at'), function(sessions) {

            if (sessions.length > 0) {
                var sessionsHtml = '';
                var unscheduledSessionsHtml = '';
                
                for (i = 0; i < sessions.length; i++) {
                    if (sessions[i].starts_at !== null) {
                        sessionsHtml += '<li data-datestring="'+getDateRangeString(sessions[i].starts_at, sessions[i].ends_at)+'"><a href="#session" data-p1='+sessions[i].id+'>'+sessions[i].name+'<p>'+getTimeRangeString(sessions[i].starts_at, sessions[i].ends_at)+'</p></a></li>';
                    } else {
                        unscheduledSessionsHtml += '<li><a href="#session" data-p1='+sessions[i].id+'>'+sessions[i].name+'</a></li>';
                    }
                }
                if (sessionsHtml.length > 0) {
                    eventScheduleList.html(sessionsHtml);
                    eventScheduleList.listview({
                        autodividers: true,
                        autodividersSelector: function (li) {
                            return $(li).data('datestring');
                        }
                    });
                    listify(eventScheduleList);
                    eventScheduleDiv.show(); 
                }

                if (unscheduledSessionsHtml.length > 0) {
                    eventUnscheduledList.html(unscheduledSessionsHtml);
                    listify(eventUnscheduledList);
                    eventUnscheduledDiv.show();
                }
            }
        });

        $.getJSON(getApiCall('lists', 'fields=id,name&entrySetRegistration_id='+event.entrySetRegistration_id), function(entrySets) {

            if (entrySets.length > 0) {
                var entrySetsHtml = '';
                for (i = 0; i < entrySets.length; i++) {
                    entrySetsHtml += '<li><a href="#list" data-p1=' + entrySets[i].id+'>' + entrySets[i].name + '</a></li>';
                }
                eventEntrySetList.html(entrySetsHtml);
                listify(eventEntrySetList);
                eventEntrySetDiv.show();
            }
        });

        $('.event-logo').attr('src', "images/logo-campsite-GA.png");
        

        $('.event-title').html(event.name);
        $('.event-description').html('<p>'+event.content+'</p>');
        
        var eventInfo = '';
        
        if (event.starts_at !== null) {
            eventInfo += '<h1>When?</h1>';
            eventInfo += '<p>'+getDateRangeString(event.starts_at, event.ends_at)+'</p>';
            eventInfo += '<p>'+getTimeRangeString(event.starts_at, event.ends_at)+'</p>';
        }
        
        if (event.location !== null || event.address1 !== null || event.address2 !== null) {
            eventInfo += '<h1>Where?</h1>';
            if (event.location !== null) {
                eventInfo += '<p>'+event.location+'</p>';
            }
            if (event.address1 !== null ) {
                eventInfo += '<p>'+event.address1+'</p>';
            }
            if (event.address2 !== null) {
                eventInfo += '<p>'+event.address2+'</p>';
            }
        }
        
        $('#event-info').html(eventInfo);
        
    });
});