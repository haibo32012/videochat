










/**
* Initialize the canvas'size with the video's size
*/
function initSize() {

	//alert('hello');
}

/**
* Initialize the css style of the buttons and the progress bar
* when capturing.
*/
function initStyle() {
	//setMessage('capturing...');
	//showProgress(false);
	//enableStartButton(false);
	//enableStopButton(true);
}

/**
* Start the video capture.
*/
function startCapture() {
	initSize();
	initStyle();
	//capturing = true;
	startTime = new Date().getTime();
	nextFrame();
}

/**
* Stop the video capture.
*/
function stopCapture() {
	//capturing = false;
	//enableStartButton(false);
}

/*****************
* Styles functions
******************/
function enableStartButton(enabled) {
	//startButton.disabled = !enabled;
}

function enableStopButton(enabled) {
	//stopButton.disabled = !enabled;
}

function showProgress(show) {
	//progress.style.visibility = show ? 'visible':'hidden';
}

function setMessage(message) {
	//msgdiv.innerHTML = message;
}