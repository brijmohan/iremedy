
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};


var MODELS = {};

function load_model(word) {
	MODELS[word] = new KerasJS.Model({
	  filepaths: {
	    model: 'static/models/'+word+'.json',
	    weights: 'static/models/'+word+'_weights.buf',
	    metadata: 'static/models/'+word+'_metadata.json'
	  },
	  gpu: true
	});
}


async function get_local_prediction(feats, phrase) {
	var words = phrase.split(' ').clean();
	var fstart = 0, featlen = 0, inputData, wfeats, outputData;
	var preds = []
	for (var widx = 0; widx < words.length; widx++) {
		var word = words[widx];
		if (!MODELS.hasOwnProperty(word)) {
			load_model(word);
		}

		console.log(word, widx);
		try {
		  	await MODELS[word].ready();
		  	featlen = MODELS[word].modelLayersMap.get("input").shape[0];
	  		wfeats = feats.slice(fstart, fstart + featlen);
	  		fstart = fstart + featlen - 1;
		  	inputData = {
		    	'input': new Float32Array(wfeats)
			}
		  	outputData = await MODELS[word].predict(inputData);
		  	console.log(outputData);
		  	preds.push({"word": word, "pred": outputData.output[1].toFixed(2)});
		} catch (err) {
		  // handle error
		}
	}
	return preds;
}