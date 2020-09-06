const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.85,      // ioU threshold for non-max suppression
    scoreThreshold: 0.85,// 0.79,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video";
        startVideo();
        $('#trackbutton').html('Stop');
        $('#intro').hide();
        $('#ui').fadeIn('slow');
        document.getElementById('sound_intro').play();

    } else {
        updateNote.innerText = "Stopping video";
        handTrack.stopVideo(video);
        isVideo = false;
        updateNote.innerText = "Video stopped";
        $('#trackbutton').html('Start');
    }
}



var searching = false;
var option_found = false;
var options = ['option1', 'option2', 'option3', 'option4', 'option5'];
var current_x = 0;
var current_y = 0;
var i = 0;
var previous_option = false;
var option_timeout = false;

function runDetection() {
    model.detect(video).then(predictions => {
        //console.log("Predictions: ", predictions);





        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);





            if (predictions && predictions[0]) {

                //console.log(predictions[0].bbox[0]+'x'+predictions[0].bbox[1]);


                current_x = ((predictions[0].bbox[0] * ($(window).width() - predictions[0].bbox[2])) / $('#canvas').width());
                current_y = ((predictions[0].bbox[1] * ($(window).height())) / $('#canvas').height());






                $('#cursor').css('left', current_x + 'px').css('top', current_y + 'px').show();





                if (searching == false) {
                    searching = true;

                    while (!option_found && i < options.length) {
                        current_option = options[i];

                        option_x = parseInt($('#' + current_option).css('left'));
                        option_x2 = option_x + parseInt($('#' + current_option).css('width'));


                        option_y = parseInt($('#' + current_option).css('top'));
                        option_y2 = option_y + parseInt($('#' + current_option).css('height'));


                        //console.log( current_x +' > '+option_x +' && '+ current_x + ' < ' + option_x2);


                        option_found = (current_x > option_x && current_x < option_x2)
                            && (current_y > option_y && current_y < option_y2);


                        i++;
                    }

                    if (option_found) {





                        if (previous_option != current_option) {

                            previous_option = current_option;



                            $('.pie_progress').asPieProgress('reset');
                            $('#' + current_option).find('.pie_progress').asPieProgress('go', 100);



                            console.log(current_option);



                            clearTimeout(option_timeout);
                            option_timeout = setTimeout(function () {
                                openOption(current_option);
                            }, 1500);

                        }

                    } else {
                        previous_option = false;


                        $('.pie_progress').asPieProgress('reset');

                        clearInterval(option_timeout);
                    }

                    searching = false;
                    option_found = false;
                    i = 0;
                }







            } else {

                $('#cursor').hide();
            }


        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!";
    trackButton.disabled = false;
    $('#trackbutton').html('<i class="fas fa-play"></i> &nbsp;Start Webcam').css('background', '#0295C8');
});




// options

function openOption(current_option) {

    document.getElementById('sound_click').play();




    if (current_option == 'option1') {
        html = '<h2>Latest Photo @vivirenremoto</h2><img src="https://scontent-mad1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/117092380_1349625508762097_15107043003097979_n.jpg?_nc_ht=scontent-mad1-1.cdninstagram.com&_nc_cat=105&_nc_ohc=b9JzS7u9ZQgAX8gfX70&oh=f5eb9d57162c75c4a2062778caa8e68d&oe=5F5E88DF" style="max-width:300px;">';// '<iframe width="560" height="315" src="https://www.youtube.com/embed/NlnFc54t-78?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

    } else if (current_option == 'option2') {
        html = '<h2>Latest Tweet @vivirenremoto</h2><iframe id="twitter-widget-0" scrolling="no" allowtransparency="true" allowfullscreen="true" class="" style="position: static; visibility: visible; width: 550px; height: 569px; display: block; flex-grow: 1;background:#fafafa;" title="Twitter Tweet" src="https://platform.twitter.com/embed/index.html?dnt=false&amp;embedId=twitter-widget-0&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=1288317275683135488&amp;lang=en&amp;origin=https%3A%2F%2Fpublish.twitter.com%2F%3Fquery%3Dhttps%253A%252F%252Ftwitter.com%252Fvivirenremoto%252Fstatus%252F1288317275683135488%26widget%3DTweet&amp;theme=light&amp;widgetsVersion=223fc1c4%3A1596143124634&amp;width=550px" data-tweet-id="1288317275683135488" frameborder="0"></iframe>';
    } else if (current_option == 'option3') {
        html = '<h2>Latest Video on Youtube</h2><iframe width="560" height="315" src="https://www.youtube.com/embed/6hbCFiBJLUI?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    } else if (current_option == 'option4') {
        html = '<h2>Credits</h2><ul><li><a href="https://github.com/victordibia/handtrack.js/" target="_blank">handtrack.js</a> by Victor Dibia</li><li><a href="https://github.com/amazingSurge/jquery-asPieProgress" target="_blank">jquery-asPieProgress</a> by Creation Studio Limited</li><li>Graphics and sounds by Nintendo</li><li>Concept UI by Miquel Camps @vivirenremoto</li></ul>';
    } else {
        html = '';
    }




    if (current_option == 'option5') {
        $('.btn_op').fadeIn('slow');
        $('#info').html(html).hide();
        $('#option5').hide();
        $('#canvas').show();
    } else {
        $('.btn_op').hide();
        $('#info').html(html).css('display', 'grid');
        $('#option5').fadeIn('slow');
        $('#canvas').hide();
    }
}















$(function () {
    $('.pie_progress').asPieProgress({
        'namespace': 'pie_progress'
    });
});