window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

window.requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame
})();

var video;
var width;
var height;
var canvas;
var images = [];
var ctx;
var result;
var capture;
var loopnum;
var startTime;
var capturing = false;
var msgdiv;
var progress;
var startButton;
var stopButton;
var frameTime=0;
var socket = io();

window.onload = function() {
	init();
	var onFailSoHard = function(e) {
		//console.log('Rejected!',e);
	};

	if (navigator.getUserMedia) {
		navigator.getUserMedia({
			audio:false,
			video:true
		},function(stream) {
			video.src = window.URL.createObjectURL(stream);
		},onFailSoHard);
	} else {

	}
};


/**
* Set the HTML elements we need.
*/
function init() {
	video = document.getElementById('campreview');
	canvas = document.createElement('canvas');
	ctx = canvas.getContext('2d');
	result = document.getElementById('result');
	msgdiv = document.getElementById('information');
	progress = document.getElementById('progress');
	startButton = document.getElementById('startButton');
	stopButton = document.getElementById('stopButton');
}

/**
* Capture the next frame of the video.
*/
function nextFrame() {
	if(frameTime < 50) {
		frameTime++;
		var imageData;
		ctx.drawImage(video,0,0,width,height);
		imageData = ctx.getImageData(0,0,width,height);
		images.push({duration:new Date().getTime() - startTime,datas:imageData});
		startTime = new Date().getTime();
		requestAnimationFrame(nextFrame);
	} else {
		requestAnimationFrame(finalizeVideo);
		frameTime = 0;
	}
}

/**
* Start the encoding of the captured frames.
*/
function finalizeVideo() {
	var capture = new Whammy.Video();
	setMessage('Encoding video...');
	progress.max = images.length;
	showProgress(true);
	encodeVideo(capture,0);
}

/**
* Encode the captured frames.
*/
function encodeVideo(capture,currentImage) {
	if(currentImage < images.length) {
		ctx.putImageData(images[currentImage].datas,0,0);
		capture.add(ctx,images[currentImage].duration);
		delete images[currentImage];
		progress.value = currentImage;
		currentImage++;
		setTimeout(function() {
			encodeVideo(capture,currentImage);
		},5);
	} else {
		var output = capture.compile();
		socket.emit('videoMessage',{video:output});
		setMessage('Finished');
		images = [];
		enableStartButton(true);
	}
}

/**
* Initialize the canvas'size with the video's size
*/
function initSize() {
	width = video.clientWidth;
	height = video.clientHeight;
	canvas.width = width;
	canvas.height = height;
	//alert('hello');
}

/**
* Initialize the css style of the buttons and the progress bar
* when capturing.
*/
function initStyle() {
	setMessage('capturing...');
	showProgress(false);
	enableStartButton(false);
	enableStopButton(true);
}

/**
* Start the video capture.
*/
function startCapture() {
	initSize();
	initStyle();
	capturing = true;
	startTime = new Date().getTime();
	nextFrame();
}

/**
* Stop the video capture.
*/
function stopCapture() {
	capturing = false;
	enableStartButton(false);
}

/*****************
* Styles functions
******************/
function enableStartButton(enabled) {
	startButton.disabled = !enabled;
}

function enableStopButton(enabled) {
	stopButton.disabled = !enabled;
}

function showProgress(show) {
	progress.style.visibility = show ? 'visible':'hidden';
}

function setMessage(message) {
	msgdiv.innerHTML = message;
}



socket.on('message',function(data) {
	result.src= data;
});

socket.on('image',function(data) {
	var canvas = document.getElementById('imgCanvas');
	var ctx = canvas.getContext('2d');

	var uint8Arr = new Uint8Array(data.buffer);
	var str = String.fromCharCode.apply(null,uint8Arr);
	var base64String = btoa(str);

	var img = new Image();
	img.onload = function() {
		var x = 0;
		var y = 0;
		ctx.drawImage(this,x,y);
	}
	img.src = 'data:image/jpg;base64,' + base64String;
});
