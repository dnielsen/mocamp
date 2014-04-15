$(document).on("pagebeforehide", "#list", function(e, data) {
    entrySetEntryList.empty();
    entrySetEntriesDiv.hide();
});

$(document).on("pagebeforeshow", "#list", function(e, data) {

    var entry_set_id  = store.p1;
    
    if (entry_set_id === null) {
        $.mobile.navigate('#group');
    }
    
    // Get general data about the list
    $.getJSON(getApiCall('lists/'+entry_set_id, 'fields=name,description,parent'), function(entrySet) {

        // if (parent.avatarPath != null) {
        //     $('.entrySet-logo').attr('src', parent.avatarPath);
        // } else {
        $('.entrySet-logo').attr('src', "images/logo-campsite-GA.png");
        // }
        
        $('.entrySet-title').html(entrySet.name);

        if (entrySet.description !== null) {
            $('.entrySet-description').html('<p>'+entrySet.description+'</p>');    
        }
        upButton.html('<a href="#'+entrySet.parent.type.toLowerCase()+'" class="ui-btn ui-icon-arrow-l ui-btn-icon-left" data-p1='+entrySet.parent.id+' data-direction="reverse">'+entrySet.parent.type+'</a>');
    });

    // Get the entries for the list, sorted by id
    $.getJSON(getApiCall('entries', 'fields=id,name&entrySet_id='+entry_set_id+'&sort_by=id'), function(entries) {

        // Get votes for all entries in this list, sorted by entry id
        $.getJSON(getApiCall('votes', 'fields=idea,user&idea_details="entrySet_id='+entry_set_id+'"&sort_by=idea'), function(votes) {

            // Assign the initial number of votes for each entry to 0
            $.each(entries, function() {
                this.num_votes = 0;
            });

            if (votes.length > 0) {
                var vote_counter  = 0;
                var entry_idx     = 0;

                // Iterate through the votes and update the data in the entry list
                for (var v in votes) {

                    // If we are done with this entry, record the number of votes and reset the counter
                    if (votes[v].idea != entries[entry_idx].id) {
                        entries[entry_idx].num_votes = vote_counter;
                        vote_counter = 0;
                    } 

                    // Every vote has an entry, but some entries do not have votes
                    // Fast forward the entry_idx until it matches the current vote
                    for (; entry_idx < entries.length; entry_idx++) {
                        if (entries[entry_idx].id == votes[v].idea) {
                            break;
                        }
                    }

                    // Increment the vote counter for the current entry
                    vote_counter++;

                    // If this vote was made by the current user, change the vote button for this entry to an unvote button
                    if (votes[v].user == localStorage['username']) {
                        entries[entry_idx].voted = true;
                    }

                    // If this is the last vote, record the number of votes now, as there won't be another iteration to do it in
                    if (v == votes.length-1) {
                        entries[entry_idx].num_votes = vote_counter;
                    }

                }
            }

            // Sort entry list by number of votes
            entries.sort(function(a, b) {
                return b.num_votes - a.num_votes;
            });

            // Populate list with entry data and vote buttons
            if (entries.length > 0) {
                var entriesHtml = '';
                for (var i = 0; i < entries.length; i++) {

                    entriesHtml += '<li><a href="#entry" data-p1='+entries[i].id+'>'+entries[i].name+'<p id="num-votes-'+entries[i].id+'">'+entries[i].num_votes+' votes</p></a>';

                    if (localStorage['api_key'] !== undefined) {
                        if (entries[i].voted !== undefined) {
                            entriesHtml += '<a href="javascript:void(0);" data-id='+entries[i].id+' class="vote unVoteBtn" data-icon="arrow-d" data-action="unvote"></a>';
                        } else {
                            entriesHtml += '<a href="javascript:void(0);" data-id='+entries[i].id+' class="vote voteBtn" data-icon="arrow-u" data-action="vote"></a>';
                        }
                    }
                    entriesHtml += '</li>';
                }
                entrySetEntryList.html(entriesHtml);
                listify(entrySetEntryList);
                entrySetEntriesDiv.show();
            }
        });
    });
});

$(document).on('click', '.vote', function() {

    var entry_id = $(this).data('id');
    var action = $(this).data('action');
    var votes = $('#num-votes-'+entry_id);
    var num_votes = votes.html().split(' ')[0];

    if (action == 'vote') {

        $.ajax({
            type: 'POST',
            url: api_channel+'://'+api_host+'/votes',
            beforeSend: function (request) {
                request.setRequestHeader("x-api-key", api_key);
            },
            data: {'idea': entry_id},
            dataType: 'json'
        });

        $(this).removeClass('voteBtn').addClass('unVoteBtn');
        $(this).data('action', 'unvote');
        $(this).buttonMarkup({ icon: "arrow-d" });
        num_votes++;

    } else {

        $.ajax({
            type: 'DELETE',
            url: api_channel+'://'+api_host+'/votes/'+entry_id,
            beforeSend: function (request) {
                request.setRequestHeader("x-api-key", api_key);
            },
            dataType: 'json'
        });

        $(this).removeClass('unVoteBtn').addClass('voteBtn');
        $(this).data('action', 'vote');
        $(this).buttonMarkup({ icon: "arrow-u" });
        num_votes--;
    }
    votes.html(num_votes + ' votes');
});