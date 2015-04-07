var canvas = new fabric.Canvas('myCanvas');

$(document).ready(function() {
	main();
});
function main(){
	//main function.
	var tool='none';
	var color='black'
	var pressed = false;
	var initX,initY;
	var state = 'create';
	var selected = null;
	var copied = null;
    var copiedObjects = new Array();
    var mode = "add",
        currentShape;

	canvas.clear();

	$(".mode").click(function(){
		tool = $(this).attr('id');
		canvas.isDrawingMode = false;
		if(tool ==='copy'){
			//copied = canvas.getActiveObject();
            if(canvas.getActiveGroup()){
                for(var i in canvas.getActiveGroup().objects){
                    var object = fabric.util.object.clone(canvas.getActiveGroup().objects[i]);
                    console.log(object.top,object.left);
                    object.set("top", object.top+5);
                    object.set("left", object.left+5);
                    copiedObjects[i] = object;
                }
            }
            else if(canvas.getActiveObject()){
                var object = fabric.util.object.clone(canvas.getActiveObject());
                object.set("top", object.top);
                object.set("left", object.left);
                copied = object;
                copiedObjects = new Array();
            }
		}
		if(tool ==='cut'){
			//copied = canvas.getActiveObject();
            if(canvas.getActiveGroup()){
                for(var i in canvas.getActiveGroup().objects){
                    var object = fabric.util.object.clone(canvas.getActiveGroup().objects[i]);
                    object.set("top", object.top+5);
                    object.set("left", object.left+5);
                    copiedObjects[i] = object;
                }
                var k = canvas.getActiveGroup().objects.length;
                while(k){
                    k = k - 1;
                    canvas.remove(canvas.getActiveGroup().objects[k]);
                }
            }
            else if(canvas.getActiveObject()){
                var object = fabric.util.object.clone(canvas.getActiveObject());
                object.set("top", object.top);
                object.set("left", object.left);
                copied = object;
                copiedObjects = new Array();
                canvas.remove(canvas.getActiveObject());
                canvas.renderAll();
            }

		}
	});
	$(".color").click(function(){
		color=$(this).attr('id');
        canvas.freeDrawingBrush.color=color;
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
                var pos = canvas.getPointer(options.e);
                if (mode === "add") {
                    var polygon = new fabric.Polygon([{
                        x: pos.x,
                        y: pos.y
                    }, {
                        x: pos.x + 0.5,
                        y: pos.y + 0.5
                    }], {
                        fill: 'blue',
                        opacity: 0.5,
                        selectable: false,
                        originX: pos.x,
                        originY: pos.y
                    });
                    currentShape = polygon;
                    canvas.add(currentShape);
                    mode = "edit";
                } else if (mode === "edit" && currentShape && currentShape.type === "polygon") {
                    var points = currentShape.get("points");
                    points.push({
                        x: pos.x - currentShape.get("left"),
                        y: pos.y - currentShape.get("top")
                    });
                    currentShape.set({
                        points: points
                    });
                    canvas.renderAll();
                }
                break;
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
                canvas.isDrawingMode = true;
				canvas.freeDrawingBrush.width = 3;
                break;
			}

			case 'paste':{
				//var clone = copied.clone();
				//clone.set({
				//	top:initY,
				//	left:initX
				//})
				//canvas.add(clone);
                if(copiedObjects.length > 0){
                    for(var i in copiedObjects){
                       // console.log(copiedObjects[i].top, copiedObjects[i].left);
                        var clone = copiedObjects[i].clone()
                        canvas.add(clone);
                    }
                }
                else if(copied){
                    copied.set({
                        top:initY,
                        left:initX
                    })
                    canvas.add(copied);
                }
                canvas.renderAll();
                break;
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
            case 'polygon':{
                var pos = canvas.getPointer(options.e);
                if (mode === "edit" && currentShape) {
                    var points = currentShape.get("points");
                    points[points.length - 1].x = pos.x - currentShape.get("left");
                    points[points.length - 1].y = pos.y - currentShape.get("top");
                    currentShape.set({
                        points: points
                    });
                    canvas.renderAll();
                }
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

    fabric.util.addListener(window, 'keyup', function (e) {
        if (e.keyCode === 27) {
            if (mode === 'edit' || mode === 'add') {
                mode = 'normal';
                currentShape.set({
                    selectable: true
                });
                currentShape._calcDimensions(false);
                var minX = 0,
                    minY = 0,
                    maxX = 0,
                    maxY = 0;
                for (var i = 0; i < currentShape.points.length; i++) {
                    minX = Math.min(minX, currentShape.points[i].x);
                    minY = Math.min(minY, currentShape.points[i].y);
                    maxX = Math.max(maxX, currentShape.points[i].x);
                    maxY = Math.max(maxY, currentShape.points[i].y);
                }
                currentShape.setCoords();
                //canvas.restore();
            } else {
                mode = 'add';
            }
            currentShape = null;
        }
    })

}