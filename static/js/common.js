//alert('brij!');
//importScript('MediaWiki:Tutorial-QuickRC.js');

/**
 * Tutorial script: QuickRC ("Quick Recent Changes")
 *
 * A tutorial user script which adds a "Quick changelog" link to the page skin's
 * toolbox, and when clicked it pops up a dialog with up to 25 recent edits.
 *
 * Demonstrates:
 * - Use of the API
 * - Use of jQuery
 * - Use of ResourceLoader and some of the default modules that come with it
 * - Use of localization
 *
 * (Be bold and improve it!)
 *
 * Authors:
 * Erik Moeller, 2011, public domain
 * Brion Vibber, 2012, public domain
 */



  var audio_context;
  var recorder;


 /* function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    console.log('Recording...');
  }

  function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    console.log('Stopped recording.');
    
    // create WAV download link using audio data blob
    createDownloadLink(button);
    
    recorder.clear();
  }
  */
  
  

  function createDownloadLink(stpRecBtn) {
    recorder && recorder.exportWAV(function(blob) {
      var url = URL.createObjectURL(blob);
      var li = document.createElement('span');
      var au = document.createElement('audio');
      //var hf = document.createElement('a');
      
      au.controls = true;
      au.src = url;
      //hf.href = url;
      //hf.download = new Date().toISOString() + '.wav';
      //hf.innerHTML = hf.download;
      li.appendChild(au);
      //li.appendChild(hf);
      stpRecBtn.nextElementSibling.appendChild(li);
    });
  }

function getScripts(scripts, callback) {
    var progress = 0;
    scripts.forEach(function(script) { 
        $.getScript(script, function () {
            if (++progress == scripts.length) callback();
        }); 
    });
}

var messages = {
    'en': {
        'quickchanges-title': 'Pronunciation evaluation results!',
        'quickchanges-greeting': 'Welcome, $1!',
        'quickchanges-intro': 'The following pages have been recently modified:',
        'quickchanges-link': 'Quick changelog',
        'quickchanges-tooltip': 'Show a quick overview of changes'
    },
    'fr': {
        'quickchanges-title': 'Bonjour !',
        'quickchanges-greeting': 'Bienvenue, $1!',
        'quickchanges-intro': 'Ces pages ont été modifiées récemment :',
        'quickchanges-link': 'Modifications récentes'
        // Leave tooltip out to demonstrate fallback behavior
    }
};

// This is the list of words that need to be added to the recognizer
// This follows the CMU dictionary format
var wordList = [
          ["whats", "W AH T S"], 
          ["your", "Y UH R"], 
          ["name", "N EY M"], 
          ["sil", "SIL"],
          ["w", "W"],
          ["ah", "AH"],
          ["t", "T"],
          ["s", "S"],
          ["y", "Y"],
          ["uh", "UH"],
          ["r", "R"],
          ["n", "N"],
          ["ey", "EY"],
          ["m", "M"],
          ["l", "L"],
          ["ae", "AE"],
          ["er", "ER"],
          ["aa", "AA"],
          ["ch", "CH"],
          ["k", "K"],
          ["d", "D"],
          ["p", "P"],
          ["hh", "HH"],
          ["sh", "SH"],
          ["z", "Z"],
          ["th", "TH"],
          ["ao", "AO"],
          ["uw", "UW"],
          ["ng", "NG"],
          ["eh", "EH"],
          ["iy", "IY"],
          ["ay", "AY"]
];

var valid_words = []
for (var w = 0; w < wordList.length; w++) {
	valid_words.push(wordList[w][0]);
}

var grammarWords = {
              numStates: 6, 
              start: 0, 
              end: 5, 
              transitions: [
                {from: 0, to: 1, word: "sil"}, 
                {from: 1, to: 2, word: "whats"}, 
                {from: 2, to: 3, word: "your"}, 
                {from: 3, to: 4, word: "name"}, 
                {from: 4, to: 5, word: "sil"}, 
                {from: 4, to: 5, word: ""}
                ]
              };

  var grammarAlign = {
              numStates: 13, 
              start: 0, 
              end: 12, 
              transitions: [
                {from: 0, to: 1, word: "sil"}, 
                {from: 1, to: 2, word: "w"}, 
                {from: 2, to: 3, word: "ah"}, 
                {from: 3, to: 4, word: "t"}, 
                {from: 4, to: 5, word: "s"}, 
                {from: 5, to: 6, word: "y"},
                {from: 6, to: 7, word: "uh"}, 
                {from: 7, to: 8, word: "r"}, 
                {from: 8, to: 9, word: "n"}, 
                {from: 9, to: 10, word: "ey"}, 
                {from: 10, to: 11, word: "m"},
                {from: 11, to: 12, word: "sil"},
                {from: 11, to: 12, word: ""}
                ]
              };

  var grammarNeighbors = {
              numStates: 13, 
              start: 0, 
              end: 12, 
              transitions: [
                {from: 0, to: 1, word: "sil"}, 
                {from: 1, to: 2, word: "w"}, 
                {from: 1, to: 2, word: "l"}, 
                {from: 1, to: 2, word: "y"}, 
                {from: 2, to: 3, word: "ah"}, 
                {from: 2, to: 3, word: "ae"}, 
                {from: 2, to: 3, word: "er"}, 
                {from: 2, to: 3, word: "aa"}, 
                {from: 3, to: 4, word: "t"}, 
                {from: 3, to: 4, word: "ch"}, 
                {from: 3, to: 4, word: "k"}, 
                {from: 3, to: 4, word: "d"}, 
                {from: 3, to: 4, word: "p"}, 
                {from: 3, to: 4, word: "hh"}, 
                {from: 4, to: 5, word: "s"}, 
                {from: 4, to: 5, word: "sh"}, 
                {from: 4, to: 5, word: "z"}, 
                {from: 4, to: 5, word: "th"}, 
                {from: 5, to: 6, word: "y"},
                {from: 5, to: 6, word: "w"},
                {from: 5, to: 6, word: "r"},
                {from: 6, to: 7, word: "uh"}, 
                {from: 6, to: 7, word: "ao"}, 
                {from: 6, to: 7, word: "uw"}, 
                {from: 7, to: 8, word: "r"}, 
                {from: 7, to: 8, word: "y"}, 
                {from: 7, to: 8, word: "l"}, 
                {from: 8, to: 9, word: "n"}, 
                {from: 8, to: 9, word: "m"}, 
                {from: 8, to: 9, word: "ng"}, 
                {from: 9, to: 10, word: "ey"}, 
                {from: 9, to: 10, word: "eh"}, 
                {from: 9, to: 10, word: "iy"}, 
                {from: 9, to: 10, word: "ay"}, 
                {from: 10, to: 11, word: "m"},
                {from: 10, to: 11, word: "n"},
                {from: 11, to: 12, word: "sil"},
                {from: 11, to: 12, word: ""}
                ]
              };

  var grammars = [{title: "align", g: grammarAlign}, {title: "words", g: grammarWords}, {title: "neighbors", g: grammarNeighbors}];
  var grammarIds = [];

var mw = mw || {};

/*mw.messages.set(messages['en']);
var lang = mw.config.get('wgUserLanguage');
if (lang && lang != 'en' && lang in messages) {
    mw.messages.set(messages[lang]);
}*/

/*dependencies = ['/w/index.php?title=User:Brijsri/audiorecorder.js&action=raw&ctype=text/javascript',
				'/w/index.php?title=User:Brijsri/callbackmanager.js&action=raw&ctype=text/javascript',
				'/w/index.php?title=User:Brijsri/volumemeter.js&action=raw&ctype=text/javascript']
*/
dependencies = ["/static/js/audioRecorder.js", "/static/js/callbackManager.js", "/static/js/volumemeter.js"]
getScripts(dependencies, function() { 
	
	var meter = null;
	var canvasContext = null;
	var WIDTH=50;
	var HEIGHT=50;
	var rafID = null;
	
	function gotStream(stream) {
	    // Create an AudioNode from the stream.
	    mediaStreamSource = audio_context.createMediaStreamSource(stream);
	
	    // Create a new volume meter and connect it.
	    meter = createAudioMeter(audio_context);
	    mediaStreamSource.connect(meter);
	
	    // kick off the visual updating
	    drawLoop();
	}

	function drawLoop( time ) {
        if (canvasContext) {
		    // clear the background
		    canvasContext.clearRect(0,0,WIDTH,HEIGHT);
		
		    // check if we're currently clipping
		    if (meter.checkClipping())
		        canvasContext.fillStyle = "red";
		    else
		        canvasContext.fillStyle = "green";
		
		    // draw a bar based on the current volume
		    //canvasContext.fillRect(0, 0, meter.volume*WIDTH*1.4, HEIGHT);
	        //console.log(meter.volume*HEIGHT*5);
	        canvasContext.fillRect(0, HEIGHT - meter.volume*HEIGHT*5, WIDTH, meter.volume*HEIGHT*5);
		
		    // set up the next visual callback
		    rafID = window.requestAnimationFrame( drawLoop );
        }
	}
	
	// Import the jQuery dialog plugin before starting the rest of this script
		mw.loader.using(['jquery.ui.dialog'], function() {
			
		var eval_results = null;
			
	    function renderQuickRCDialog( content ) {
	    	if (!content) content = eval_results;
			var $dialog = $( '<div></div>' )
				.html(
					'<strong>' +
					mw.message('quickchanges-greeting', mw.user.getName()).escaped() +
					'</strong> ' +
					//mw.message('quickchanges-intro').escaped() +
					'<br/>' + content
					//pageLinks.join( '<br /><li>' ) + '</ul>'
				)
				.dialog({
					autoOpen: true,
					title: mw.message('quickchanges-title').plain(),
					width: '70%',
					modal: true
				});
		}
		
	// This starts recording. We first need to get the id of the grammar to use
	  var startRecording = function() {
	    //var id = document.getElementById('grammars').value;
	    if (recorder && recorder.start(0)) displayRecording(true);
	  };
	
	  // Stops recording
	  var stopRecording = function() {
	    recorder && recorder.stop();
	    displayRecording(false);
	  };
	
	  function startUserMedia(stream) {
	//  var input = audio_context.createMediaStreamSource(stream);
	    console.log('Media stream created.');
		var input = audio_context.createMediaStreamSource(stream);
	    // Firefox hack https://support.mozilla.org/en-US/questions/984179
	    window.firefox_audio_hack = input; 
	    var audioRecorderConfig = {errorCallback: function(x) {updateStatus("Error from recorder: " + x);}};
	    recorder = new AudioRecorder(input, audioRecorderConfig);
	    // If a recognizer is ready, we pass it to the recorder
	    if (recognizer) recorder.consumers = [recognizer];
	    isRecorderReady = true;
	    updateUI();
	    updateStatus("Audio recorder ready");
	//  recorder = new Recorder(input);
	    console.log('Recorder initialised.');
	    gotStream(stream);
	  }

	
	// These will be initialized later
	var recognizer, recognizer1, recognizer2, recorder, callbackManager, audioContext, outputContainer;
	// Only when both recorder and recognizer do we have a ready application
	var isRecorderReady = true, isRecognizerReady = false;
	
	// A convenience function to post a message to the recognizer and associate
	// a callback to its response
	function postRecognizerJob(message, callback) {
	    var msg = message || {};
	    if (callbackManager) msg.callbackId = callbackManager.add(callback);
	    if (recognizer) recognizer.postMessage(msg);
	}
	
	// To display the hypothesis sent by the recognizer
	function updateHyp(hyp) {
	    //if (outputContainer) outputContainer.innerHTML = hyp;
	}
	
	// This updates the UI when the app might get ready
	// Only when both recorder and recognizer are ready do we enable the buttons
	function updateUI() {
	    //if (isRecorderReady && isRecognizerReady) startBtn.disabled = stopBtn.disabled = false;
	};
	
	// This is just a logging window where we display the status
	function updateStatus(newStatus) {
	    //document.getElementById('current-status').innerHTML += "<br/>" + newStatus;
	};
	
	// A not-so-great recording indicator
	function displayRecording(display) {
	    //if (display) document.getElementById('recording-indicator').innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	    //else document.getElementById('recording-indicator').innerHTML = "";
	};
	
	// This function initializes an instance of the recorder
	// it posts a message right away and calls onReady when it
	// is ready so that onmessage can be properly set
	function spawnWorker(workerURL, onReady) {
		recognizer = new Worker(workerURL);
		recognizer.onmessage = function(event) {
			onReady(recognizer);
		};
		recognizer.postMessage('');
	}
	
	// We get the grammars defined below and fill in the input select tag
	var updateGrammars = function() {
	    var selectTag = document.getElementById('grammars');
	    for (var i = 0 ; i < grammarIds.length ; i++) {
	        var newElt = document.createElement('option');
	        newElt.value=grammarIds[i].id;
	        newElt.innerHTML = grammarIds[i].title;
	        if (grammarIds[i].title == "align") {
	          newElt.selected = "selected";
	        }
	        selectTag.appendChild(newElt);
	    }                          
	};
	
	// Called once the recognizer is ready
	// We then add the grammars to the input select tag and update the UI
	var recognizerReady = function() {
	   //updateGrammars();
	   isRecognizerReady = true;
	   updateUI();
	   updateStatus("Recognizer ready");
	   //$('#load_symbol').hide();
	};
	      
	// This adds a grammar from the grammars array
	// We add them one by one and call it again as
	// a callback.
	// Once we are done adding all grammars, we can call
	// recognizerReady()
	var feedGrammar = function(g, index, id) {
	    if (id && (grammarIds.length > 0)) grammarIds[0].id = id.id;
	    if (index < g.length) {
	      	grammarIds.unshift({title: g[index].title})
	  		postRecognizerJob({command: 'addGrammar', data: g[index].g},
	                function(id) {feedGrammar(grammars, index + 1, {id:id});});
	    } else {
	      recognizerReady();
	    }
	}
	
	// This adds words to the recognizer. When it calls back, we add grammars
	var feedWords = function(words) {
	    postRecognizerJob({command: 'addWords', data: words},
	        function() {feedGrammar(grammars, 0);});
	};
	
	// This initializes the recognizer. When it calls back, we add words
	var initRecognizer = function() {
	    // You can pass parameters to the recognizer, such as : {command: 'initialize', data: [["-hmm", "my_model"], ["-fwdflat", "no"]]}
	    postRecognizerJob({command: 'initialize'},
	                        function() {
	                            if (recorder) recorder.consumers = [recognizer];
	                            feedWords(wordList);
	                     });
	};
	
	
	$(document).ready( function() {
		
		callbackManager = new CallbackManager();
		spawnWorker("/w/index.php?title=User:Brijsri/recognizer.js&action=raw&ctype=text/javascript", function(worker) {
            // This is the onmessage function, once the worker is fully loaded
            worker.onmessage = function(e) {
                // This is the case when we have a callback id to be called
                if (e.data.hasOwnProperty('id')) {
                  var clb = callbackManager.get(e.data['id']);
                  var data = {};
                  if ( e.data.hasOwnProperty('data')) data = e.data.data;
                  if(clb) clb(data);
                }
                // This is a case when the recognizer has a new hypothesis
                if (e.data.hasOwnProperty('hyp')) {
                  var newHyp = e.data.hyp;
                  if (e.data.hasOwnProperty('final') &&  e.data.final) {
                    newHyp = "Final: " + newHyp;

                    // Calculate mean
                    var mean = 0.0;
                    var hypseg = e.data.hypseg;
                    var cnt = 0;
                    for (var i = 0; i < hypseg.length; i++) {
                      if (valid_words.indexOf(hypseg[i].word) != -1) {
                        cnt++;
                        mean += hypseg[i].ascr;
                      }
                    }
                    mean /= cnt;

                    // Calculate std deviation
                    cnt = 0;
                    var std = 0;
                    for (var i = 0; i < hypseg.length; i++) {
                      if (valid_words.indexOf(hypseg[i].word) != -1) {
                        cnt++;
                        var diff = (hypseg[i].ascr - mean)
                        std += (diff * diff);
                      }
                    }
                    std /= cnt;

                    std = Math.sqrt(std);

                    console.log("Mean = " + mean);
                    console.log("Std = " + std);

                    var mean_var_str = "<p> Mean : " + mean.toFixed(2) + "<br> Std. deviation : " + std.toFixed(2) + "</p>"

                    //var table_str = "<table border='1'><tr><td>Word</td><td>Normalized score</td><td>Duration</td></tr>";
                    var table_str = "<table class='table table-bordered'>";
                    var tr1 = "<tr><th>Word</th>";
                    var tr2 = "<tr><th>Normalized score</th>";
                    var tr3 = "<tr><th>Duration</th>";
                    for (var i = 0; i < hypseg.length; i++) {
                      if (valid_words.indexOf(hypseg[i].word) != -1) {
                        var score = (hypseg[i].ascr - mean) / std;
                        //table_str += "<tr><td>" + hypseg[i].word + "</td><td>" + score + "</td><td>" + ((hypseg[i].end - hypseg[i].start)/100.0) + "</td></tr>";
                        tr1 += "<td>" + hypseg[i].word + "</td>";
                        tr2 += "<td>" + score.toFixed(2) + "</td>";
                        tr3 += "<td>" + ((hypseg[i].end - hypseg[i].start)/100.0) + "</td>";
                        console.log("Word = " + hypseg[i].word + " : Score = " + score + " : Duration = " + (hypseg[i].end - hypseg[i].start)/100.0);
                      }
                    }
                    table_str += (tr1 + "</tr>");
                    table_str += (tr2 + "</tr>");
                    table_str += (tr3 + "</tr>");
                    table_str += "</table>";

                    content_str = newHyp + "<br><br>" + mean_var_str + table_str + "<br>" + "<img class='fbimg' src='https://raw.githubusercontent.com/brijmohan/iremedy/gh-pages/feedback.png'>";
					eval_results = content_str;
					
                    //updateHyp(newHyp + "<br><br>" + mean_var_str + table_str + "<br>");
                    renderQuickRCDialog(content_str);


                  } else {
                    updateHyp(newHyp);
                  }
                  console.log(e.data);
                  
                }
                // This is the case when we have an error
                if (e.data.hasOwnProperty('status') && (e.data.status == "error")) {
                }
            };
            // Once the worker is fully loaded, we can call the initialize function
            initRecognizer();
        });


		
	    try {
	      // webkit shim
	      window.AudioContext = window.AudioContext || window.webkitAudioContext;
	      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	      window.URL = window.URL || window.webkitURL;
	      
	      audio_context = new AudioContext;
	      console.log('Audio context set up.');
	      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
	    } catch (e) {
	      alert('No web audio support in this browser!');
	    }
	    
	    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
	      console.log('No live audio input: ' + e);
	    });
	  });

	$(document).ready( function() {
		
		
			//alert($('.audiotable tbody tr').length);
			$('.audiotable tbody tr').append('<td>Try saying: \
						<button type="button" class="btn btn-default btn-rec">Record <i class="material-icons">fiber_manual_record</i></button> \
						<canvas class="meter" height="35px" width="25px"></canvas> \
						<button type="button" class="btn btn-default btn-stop">Stop <i class="material-icons">stop</i></button> \
						<span class="recaudio"></span> \
						<button type="button" class="btn btn-default btn-eq">Evaluate <i class="material-icons">equalizer</i></button> \
						<button type="button" class="btn btn-default btn-say">Say in phrase <i class="material-icons">insert_link</i></button> \
					</td>');
					
			// Attach events
			$('.audiotable').on('click', 'button.btn-rec', function(evt) {
				//alert('Started recording...');
				startRecording();
                // grab our canvas
                console.log(evt.target);
    			canvasContext = $(evt.target).parents('td').find('.meter')[0].getContext("2d");
    			drawLoop();
			});
			$('.audiotable').on('click', 'button.btn-stop', function(evt) {
				//alert('Stopped recording...');
				stopRecording();
                // grab our canvas
    			canvasContext = null;
			});
			/*$('.audiotable').on('click', 'button.btn-play', function(evt) {
				alert('Started playing...');
			});*/
			$('.audiotable').on('click', 'button.btn-say', function(evt) {
				alert('Start saying...');
			});
		
			$('.audiotable').on('click', 'button.btn-eq', function(evt) {
				renderQuickRCDialog();
			});
			
			
	});
	
});
});

