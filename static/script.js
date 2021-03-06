 $(function(){

    const img_folder = `${window.origin}/static/players`

    const possible_score = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 
        128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 164, 165, 167, 168, 170, 171, 174, 177, 180]

    $.ajaxSetup({
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                console.log('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                console.log('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                console.log('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                console.log('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                console.log('Time out error.');
            } else if (exception === 'abort') {
                console.log('Ajax request aborted.');
            } else {
                console.log('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });
    
    
    
    var makePostCall = function (url, data, success) { // here the data and url are not hardcoded anymore
        var json_data = JSON.stringify(data);

        return $.ajax({
            type: "POST",
            url: url,
            data: json_data,
            dataType: "json",
            contentType: "application/json",
            success:success    
        });
    };



    var render_gamebox = (response) => {
        if (window.screen.width < 580) {
            var game_div = $("#game_div_mobile");
        } else {
            var game_div = $("#game_div_desktop");
        }
            
        console.log(response)
        let player1 = response["player1"];
        let player2 = response["player2"];
        $($(".player-img")[0]).attr("src", `${img_folder}/${player1["img_path"]}`);
        $($(".player-img")[1]).attr("src", `${img_folder}/${player2["img_path"]}`);
        $(".player-name h2")[0].innerText = player1["name"];
        $(".player-name h2")[1].innerText = player2["name"];
        //$("#greeting").css("display", "none");
        $("#game-settings").css("display", "none");
        game_div.css("display", "block");
        
    }
        // make http request
    var enter_score = (e) => {
        if(e.which === 13){
            $(this).attr("disabled", "disabled");
            score = parseInt($(e.target).val());
            player = 1;
            if (e.target.id=="user-score-2"){
                player = 2;
            }
            validate_request(player,score);
            // change player
        }
        $(this).removeAttr("disabled");
    }
    var validate_request = (player, score) => {
        return ($.ajax({
            type: 'GET',
            url: `${window.origin}/validate/${player}/${score}`,
            success: function(res){
                open_score = res.current_score;
                player_name = res.name;
                display_open_score(open_score, player);
                display_last_score(score, player);
                display_match_stats(res, player);
                play_audio(score);
                if (open_score == 0){
                    win_game(player);
                } else {
                    clear_score(player);
                }
                
            },//wer bist du?),
            error: function() {
                    alert("Could not get score. Try again.")
                }
            })
        )
    }

    var delete_score = () => {
        var player = (event.target == $(".delete-score")[0])? 1 : 2;
        return ($.ajax({
            type: 'GET',
            url: `${window.origin}/delete-last-score/${player}`,
            success: function(res){
                open_score = res.current_score;
                player_name = res.name;
                var score_elem = player == 1 ? "#pl1_score": "#pl2_score";
                var last_elem = player == 1 ? "#pl1_last_score": "#pl2_last_score";
                $(`${score_elem} li`).last().remove();
                $(`${score_elem} li`).last().css("opacity", "100%");
                $(`${last_elem} li`).last().remove();
                $(`${last_elem} li`).last().css("opacity", "100%");
                display_match_stats(res, player);
                
                
            },
            error: function() {
                    alert("No score to delete.")
                }
            })
        )
    }

    var enable_new_player = () => {
        $("#new-player-name").css("display", "block");
        $("#submit-new-player").css("display", "block");

    }
        


    var display_open_score = (open_score, player) => { 
        var elem = player == 1 ? "#pl1_score": "#pl2_score";
        $(elem).find("li").css({"opacity": "50%"})
        $(elem).append(`<li class='list-group_item score-item'>${open_score}</li>`)

    };
    var display_last_score = (last_score, player) => { 
        var elem = player == 1 ? "#pl1_last_score": "#pl2_last_score";
        $(elem).append(`<li class='list-group_item score-item'>${last_score}</li>`)

    };


    var display_match_stats = (response, player) => {
        console.log(response);
        console.log(player)
        var avg_elem = player == 1 ? $(".match-average")[0] : $(".match-average")[1]
        var count_elem = player == 1 ? $(".match-num-darts")[0] : $(".match-num-darts")[1]
        var cur_avg = response["average"];
        var cur_counter = response["dart_counter"];
        avg_elem.innerText = cur_avg;
        count_elem.innerText = cur_counter;
    }

    var clear_score = (player) => { 
        var input_elem = player == 1 ? "#user-score-1": "#user-score-2";
        var next_elem = player == 1 ? "#user-score-2":"#user-score-1";
        $(input_elem).val('');
        $(next_elem).focus();
    };
    
    var win_game = (player) => {
        window.location.href = `${window.origin}/game-end/${player}`;
    }; 
            // $("#pl2_score").append(`<li class='list-group_item score-item'>${score}</li>`)
            
    var submit_new_player = () => {
        player_name = $("#new-player-name").val();
        $.ajax({
            url: `${window.origin}/create-player`,
            data: {"name": encodeURI(player_name)},
            type: "GET",
            cache: false,
            success: function() {
                location.reload(true);
            }

        })
    };

    var play_audio = (score) => {
        var audio = new Audio(`static/audio_dateien/${score}.m4a`);
        audio.play();
    };

    $("#start-image").click(play_audio);

    $("#enter-new-player").click(enable_new_player);

    $("#submit-new-player").on("click", submit_new_player)

    $("#select-players").click(() => {
            var pl1 = $('input[name = "player1"]:checked').val();
            var pl2 = $('input[name = "player2"]:checked').val();
            console.log($(this))
            if (pl1 == pl2){
                $("<p class='error-message'>Choose different players.</p>").insertAfter($(event.target));

            } else {
                params = {
                    player1: pl1,
                    player2: pl2
                };
                var url = window.origin + "/select-player";
                makePostCall(url, data=params, success=function(res){
                    render_gamebox(res);
                });
            }
            
        });

    $('.user-score-input').on('keydown', enter_score);
    $('.user-score_input').on('keyup', function(e) {
        if(e.which === 13){ 
            e.target.value = ''
        }
    });
    $(".delete-score").on("click", delete_score);

 });