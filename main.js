$(document).ready(function() {
	main();
});
function main(){
	//main function.
	var tool='none';
	var color='black'
	var canvas = new fabric.Canvas('myCanvas');
	var pressed = false;
	var initX,initY;
	var state = 'create';
	var selected=null;
	var htmlcanvas = document.getElementById("myCanvas");
	var copied = null;
	canvas.clear();
	$(".mode").click(function(){
		tool = $(this).attr('id');
		canvas.isDrawingMode = false;
		if(tool ==='copy'){
			copied = canvas.getActiveObject();
		}
		if(tool ==='cut'){
			copied = canvas.getActiveObject();
			canvas.remove(canvas.getActiveObject());
		}
	});
	$(".color").click(function(){
		color=$(this).attr('id');
		console.log("The Color selected is:", color);
	});
	$("#clear").click(function(){
		canvas.clear();
	});
	//mouse clicked downwards, begin tracking movement.
	canvas.observe('mouse:down',function(options){
		console.log('Tools',tool);
		var pointer = options.e;
		initX = pointer.layerX;
		initY = pointer.layerY;
		canvas.isDrawingMode = false;
		switch(tool){
			case 'rect':{
				console.log("baking rectangles at X:",initX," Y",initY, "tools", tool);
				var getRekt = new fabric.Rect({
					left: initX,
					top: initY,
					fill: color,
					width: 0,
					height: 0
				});
				canvas.add(getRekt);
				selected = getRekt;
				break;
			}
			case 'ellipse':{
				//console.log("baking rectangles at X:",initX," Y",initY, "tools", tool);
				var ellipse = new fabric.Ellipse({
					left: initX,
					top: initY,
					fill: color,
					rx: 10,
					ry: 5
				});
				canvas.add(ellipse);
				selected = ellipse;
				break;

			}
			case 'circle':{
				var circle = new fabric.Circle({
					radius: 0,
					fill: color,
					left: initX,
					top: initY
				});
				canvas.add(circle);
				selected = circle;
				break;
			}
			case 'square':{
				console.log("baking rectangles at X:",initX," Y",initY, "tools", tool);

				var getSqur = new fabric.Rect({
					left: initX,
					top: initY,
					fill: color,
					width: 0,
					height: 0
				});
				canvas.add(getSqur);
				selected = getSqur;
				break;
			}
			case 'polygon':{

			}
			case 'straightline':{
				var points = [initX, initY, initX, initY];
				var line = new fabric.Line( points, {
					strokeWith: 3,
					stroke: color,
					originX: 'center',
					originY: 'center'
				})
				canvas.add(line);
				selected = line;
				break;
			}
			case 'freeline':{
				canvas.freeDrawingBrush.width = 3;
				canvas.freeDrawingBrush.color=color;
				canvas.isDrawingMode = true;
			}

			case 'paste':{
				var clone = copied.clone();
				clone.set({
					top:initY,
					left:initX
				})
				canvas.add(clone);
			}
		}
	});



	canvas.observe('mouse:move',function(options){
		//modify the properties of the object currently creating.
		var pointer = options.e;
		var currentWidth = pointer.layerX - initX;
		var currentHeight = pointer.layerY - initY;
		switch(tool){
			case 'rect':{
				if(selected!==null){
					console.log('modifying selected object');
					selected.set({
						width: currentWidth,
						height: currentHeight,
						left:initX,
						top:initY

					})
				}
				canvas.renderAll();
				break;
			}
			case 'square':{
				if(currentWidth>=currentHeight){
					currentHeight = currentWidth;

				}else if(currentWidth<currentHeight){
					currentWidth = currentHeight
				}
				if(selected!==null){
					console.log('modifying selected object');
					selected.set({
						width: currentWidth,
						height: currentHeight,
						left:initX,
						top:initY

					})
				}
				canvas.renderAll();
				break;
			}
			case 'straightline':{
				if(selected!==null){
					console.log('modifying selected object');
					selected.set({
						x2: pointer.layerX,
						y2: pointer.layerY
					})
				}
				canvas.renderAll();
				break;
			}
			case 'circle':{
				if(currentWidth>=currentHeight){
					currentHeight = currentWidth;

				}else if(currentWidth<currentHeight){
					currentWidth = currentHeight
				}
				if(selected!==null){
					console.log('modifying selected object');
					selected.set({
						radius: Math.abs(currentHeight/2)
					})
				}
				canvas.renderAll();
				break;
			}
			case 'ellipse':{
				if(selected!==null){
					console.log('modifying selected object');
					selected.set({
						rx: Math.abs(currentWidth/2),
						ry: Math.abs(currentHeight/2)
					})
				}
				canvas.renderAll();
				break;
			}
		}
	});

	canvas.observe('mouse:up',function(e){
		// clear the selected object, clear initial start and end points.
		selected = null;
		initX = 0;
		initY = 0;

	});

}