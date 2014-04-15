// Clear out all the data when you leave the page
$(document).on("pagebeforehide", "#group", function(e, data) {
    groupEntrySetList.empty();
    groupEntrySetDiv.hide();

    groupUpcomingEventsList.empty();
    groupUpcomingEventsDiv.hide();
   
    groupPastEventsList.empty();
    groupPastEventsDiv.hide();
});

$(document).on("pagebeforeshow", "#group", function(e, data) {
    
    $.getJSON(getApiCall('groups/'+community_id, 'fields=name,description,entrySetRegistration_id,groupAvatar'), function(group) {

        $.getJSON(getApiCall('lists', 'fields=id,name&entrySetRegistration_id='+group.entrySetRegistration_id), function(lists) {

            if (lists !== null && lists.length > 0) {
                var entrySetsHtml = '';

                for (i = 0; i < lists.length; i++) {
                    entrySetsHtml += '<li><a href="#list" data-p1='+lists[i].id+' data-p2="group" data-p3='+group.id+'>'+lists[i].name+'</a></li>';
                }

                groupEntrySetList.html(entrySetsHtml);
                listify(groupEntrySetList);
                groupEntrySetDiv.show();
            }
        });

        $.getJSON(getApiCall('groups/'+community_id+'/events'), function(events) {

            if (events.length > 0) {
                var upcomingEventsHtml = '';
                var pastEventsHtml = '';

                for (i = 0; i < events.length; i++) {
                    if (events[i].starts_at >= (new Date()).toISOString()) {
                        upcomingEventsHtml += '<li><a href="#event" data-p1=' + events[i].id + '>' + events[i].name + '</a></li>';    
                    } else {
                        pastEventsHtml += '<li><a href="#event" data-p1=' + events[i].id + '>' + events[i].name + '</a></li>';
                    }
                }

                if (upcomingEventsHtml.length > 0) {
                    groupUpcomingEventsList.html(upcomingEventsHtml);
                    listify(groupUpcomingEventsList);
                    groupUpcomingEventsDiv.show();
                }

                if (pastEventsHtml.length > 0) {
                    groupPastEventsList.html(pastEventsHtml);
                    listify(groupPastEventsList);
                    groupPastEventsDiv.show();
                }
            }
        });


        if (group.groupAvatar !== undefined) {
            $('.group-logo').attr('src', group.groupAvatar.uri);
            $('.group-title').empty();
        } else {
            $('.group-logo').attr('src', "images/logo-campsite-GA.png");
            $('.group-title').html(group.name);
        }

        $('.group-description').html('<p>'+group.description+'</p>');

    });
    
});