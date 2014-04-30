subtitles = new Array();

document.getElementById('o-adv').addEventListener('click', function(){
	if(this.checked)
	{
		document.getElementById('simpleFormula').style.display='none';
		document.getElementById('advancedFormula').style.display='inline';
	}
	else
	{
		document.getElementById('simpleFormula').style.display='inline';
		document.getElementById('advancedFormula').style.display='none';	
	}
});



document.getElementById('files').addEventListener('change', function handleFileSelect(evt) { // save file selected for later
	subtitles = new Array();
	var files = evt.target.files; 
    for (var i = 0, f; f = files[i]; i++)
	{
		// if (!f.type.match('text.*')) {
			// continue;
		// }
		subtitles.push(f);
    }
}, false);
  
document.getElementById('formSubtitle').addEventListener('submit', function handleFileSelect(evt) {
	for(i in subtitles)
	{
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			return function(e) {
				blob = new Blob([patch(e.target.result)], {type: "text/plain;charset="+(document.getElementById('o-utf8-o').checked?"utf-8":"US-ASCII")});
				saveAs(blob,theFile.name); // propose to the user to save the new file, use the Filesaver lib
			};
		})(subtitles[i]); // closure to keep the file name
		reader.readAsText(subtitles[i],(document.getElementById('o-utf8-i').checked?"utf-8":"US-ASCII"));
	}
	evt.preventDefault();
	return false;
}, false);

function patch(text) // return the subs with new date
{
	if(document.getElementById('o-adv').checked)
	{
		formula1 = parseFormula(document.getElementById('i-formula-1').value);
		formula2 = parseFormula(document.getElementById('i-formula-2').value);
		return text.replace(/([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}) --> ([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})/g,function(){
			t1 = text2time(arguments[1]);
			t2 = text2time(arguments[2]);
			try{eval("t=Math.round("+formula1+");");}catch(e){alert("Error in the formula 1");throw new Error("Error in the formula 1");}
			if(t<0){if(document.getElementById('o-neg').checked){t=0;}else{t=text2time('99:59:59,999');}}
			replace = time2text(t)+" --> ";
			try{eval("t=Math.round("+formula2+");");}catch(e){alert("Error in the formula 2");throw new Error("Error in the formula 2");}
			if(t<0){if(document.getElementById('o-neg').checked){t=0;}else{t=text2time('99:59:59,999');}}
			replace += time2text(t);
			return replace;
		});
	}
	else
	{
		formula = parseFormula(document.getElementById('i-formula').value);
		return text.replace(/([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}) --> ([0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3})/g,function(){
			t = text2time(arguments[1]);
			try{eval("t=Math.round("+formula+");");}catch(e){alert("Error in the formula");throw new Error("Error in the formula");}
			if(t<0){if(document.getElementById('o-neg').checked){t=0;}else{t=text2time('99:59:59,999');}}
			replace = time2text(t)+" --> ";
			t = text2time(arguments[2]);
			try{eval("t=Math.round("+formula+");");}catch(e){alert("Error in the formula");throw new Error("Error in the formula");}
			if(t<0){if(document.getElementById('o-neg').checked){t=0;}else{t=text2time('99:59:59,999');}}
			replace += time2text(t);
			return replace;
		});
	}
}

function parseFormula(formula) // replace text time into number of ms in formula
{
	return formula.replace(/([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{3})/g,function(NULL,h,m,s,ms){return parseInt(ms)+parseInt(s)*1000+parseInt(m)*60*1000+parseInt(h)*60*60*1000;});
}
function text2time(time) // transform a text time into ms
{
	return parseInt(time.replace(/([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{3})/,function(NULL,h,m,s,ms){return parseInt(ms)+parseInt(s)*1000+parseInt(m)*60*1000+parseInt(h)*60*60*1000;}));
}
function time2text(time) // transform ms into text time
{
	/*h = Math.floor(time/(60*60*1000));
	time -= h*60*60*1000;
	m = Math.floor(time/(60*1000));
	time -= m*60*1000;
	s = Math.floor(time/1000);
	time -= s*1000;
	ms = time;*/
	ms = time % 1000;
	time = (time-ms)/1000;
	s = time %  60;
	time = (time-s)/60;
	m = time% 60;
	time = (time-m)/60;
	h = time;
	h = h.toString();if(h.length==1){h = "0"+h;}
	m = m.toString();if(m.length==1){m = "0"+m;}
	s = s.toString();if(s.length==1){s = "0"+s;}
	ms = ms.toString();if(ms.length==2){ms = "0"+ms;}if(ms.length==1){ms = "00"+ms;}
	return h+":"+m+":"+s+","+ms;
}