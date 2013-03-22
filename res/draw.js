var stage;
var mainLayer;
var tempLayer;
var evtLayer;

var tracking = false;

var pointArray = [];

window.onload = function(){
	stage = new Kinetic.Stage({
		container: 'stage',
		height:500,
		width:850
	});
	mainLayer = new Kinetic.Layer();
	tempLayer = new Kinetic.Layer();
	evtLayer = new Kinetic.Layer();
	stage.add(mainLayer);
	stage.add(tempLayer);
	stage.add(evtLayer);
	
	var newShape = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: stage.getWidth(),
		height: stage.getHeight(),
	});
	
	newShape.on('mousedown', function() {
		tracking = true;
	});
	
	newShape.on('mousemove', function() {
		tempLayer.removeChildren();
		var pointVal = $('#px').val();
		var shade = $('#colorPicker').spectrum('get').toRgbString();
		var mousePos = stage.getMousePosition();
		var cursor = new Kinetic.Circle({
			radius: pointVal/2,
			fill:shade,
			x:mousePos.x,
			y:mousePos.y
		});
		tempLayer.add(cursor);
		if (tracking) {
			pointArray.push(mousePos.x);
			pointArray.push(mousePos.y);
			var newShape = new Kinetic.Line({
				points: pointArray,
				stroke: shade,
				strokeWidth: pointVal,
				lineCap: 'round',
				lineJoin: 'round'
			});
			tempLayer.add(newShape);
		}
		tempLayer.draw();
	});
	
	newShape.on('mouseup', function() {
		tempLayer.removeChildren();
		tracking = false;
		var mousePos = stage.getMousePosition();
		pointArray.push(mousePos.x);
		pointArray.push(mousePos.y);
		var pointVal = $('#px').val();
		var shade = $('#colorPicker').spectrum('get').toRgbString();
		var newShape;
		if (pointArray.length == 2) {
			newShape = new Kinetic.Circle({
				radius: pointVal/2,
				fill:shade,
				x:mousePos.x,
				y:mousePos.y
			});
		}
		else {
			newShape = new Kinetic.Line({
				points: pointArray,
				stroke: shade,
				strokeWidth: pointVal,
				lineCap: 'round',
				lineJoin: 'round'
			});
		}
		mainLayer.add(newShape);
		stage.draw();
		pointArray = [];
	});
	
	evtLayer.add(newShape);
	stage.draw();
	$('#pointSlider').slider({
		value:10,
		slide: function( event, ui ) {
			$( "#px" ).val( ui.value );
		},
		min:0,
		max:750
	});
	$("#colorPicker").spectrum({
		color: 'blue',
		showInput: true,
		showAlpha: true
	});
	$( "#px" ).val( $('#pointSlider').slider('value') );
	$( '#px' ).change(function() {
		if ($('#px').val() < 1)
			$('#px').val(1);
		if ($('#px').val() > 750)
			$('#px').val(750);
		$('#pointSlider').slider('value', $('#px').val());
	});
};