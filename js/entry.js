$(document).on("pagebeforeshow", "#entry", function(e, data) {

    var entry_id = store.p1;

    if (entry_id === null) {
        $.mobile.navigate('#group');
    }

    $.getJSON(getApiCall('entries/'+entry_id, 'fields=name,description,entrySet_id'), function(entry) {
        
        // if (entrySet.avatarPath !== null) {
        //     $('.entry-logo').attr('src', entrySet.avatarPath);
        // } else {
        $('.entry-logo').attr('src', "images/logo-campsite-GA.png");
        // }

        $('.entry-title').html(entry.name);

        if (entry.description !== null) {
            $('.entry-description').html('<p>'+entry.description+'</p>');
        }
        
        upButton.html('<a href="#list" class="ui-btn ui-icon-arrow-l ui-btn-icon-left" data-p1='+entry.entrySet_id+' data-direction="reverse">List</a>');
    });
    
});