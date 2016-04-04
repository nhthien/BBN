// Jquery Plugin
// Plugin to Draw a line between to elements

(function($) {
	$.fn.connect = function(param) {

		var _canvas;
		var _ctx;
		var _lines = new Array(); //This array will store all lines (option)
		var _me = this;
		var _parent = param || document;

		//Initialize Canvas object
		_canvas = $('<canvas/>')
			// .attr('width', $('#graph_nodes').width())
			.attr('width', $('#graph_nodes').width())
			.attr('height', $('#graph_nodes').height()+200)
			.attr('id', 'canvasid')
		$('#graph_nodes').append(_canvas);

		this.drawLine = function(option) {
			//It will push line to array.
			_lines.push(option);
			this.connect(option);
		};
		this.drawAllLine = function(option) {

			/*Mandatory Fields------------------
			left_selector = '.class',
			data_attribute = 'data-right',
			*/

			if (option.left_selector != '' && typeof option.left_selector !== 'undefined' && $(option.left_selector).length > 0) {
				$(option.left_selector).each(function(index) {
					var option2 = new Object();
					$.extend(option2, option);
					option2.left_node = $(this).attr('id');
					option2.right_node = $(this).data(option.data_attribute);
					if (option2.right_node != '' && typeof option2.right_node !== 'undefined') {
						_me.drawLine(option2);

					}
				});
			}
		};

		function headerDraw(ctx,x1,y1,x2,y2,style,which,angle,d)
		{
		  'use strict';
		  
		  // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
		  // would happen instead of addition
		  
		  if(typeof(x1)=='string') x1=parseInt(x1);
		  if(typeof(y1)=='string') y1=parseInt(y1);
		  if(typeof(x2)=='string') x2=parseInt(x2);
		  if(typeof(y2)=='string') y2=parseInt(y2);
		  style = typeof(style)!='undefined'? style:1;
		  which = typeof(which)!='undefined'? which:1; // end point gets arrow
		  angle = typeof(angle)!='undefined'? angle:Math.PI/8;
		  d     = typeof(d)    !='undefined'? d    :10;
		  // default to using drawHead to draw the head, but if the style
		  // argument is a function, use it instead
		  var toDrawHead = typeof(style)!='function'?drawHead:style;

		  // For ends with arrow we actually want to stop before we get to the arrow
		  // so that wide lines won't put a flat end on the arrow.
		  //
		  var dist=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
		  var ratio=(dist-d/3)/dist;
		  var tox, toy,fromx,fromy;
		  if(which&1){
		    tox=Math.round(x1+(x2-x1)*ratio);
		    toy=Math.round(y1+(y2-y1)*ratio);
		  }else{
		    tox=x2;
		    toy=y2;
		  }
		  if(which&2){
		    fromx=x1+(x2-x1)*(1-ratio);
		    fromy=y1+(y2-y1)*(1-ratio);
		  }else{
		    fromx=x1;
		    fromy=y1;
		  }

		  // Draw the shaft of the arrow
		  ctx.beginPath();
		  ctx.moveTo(fromx,fromy);
		  ctx.lineTo(tox,toy);
		  ctx.stroke();

		  // calculate the angle of the line
		  var lineangle=Math.atan2(y2-y1,x2-x1);
		  // h is the line length of a side of the arrow head
		  var h=Math.abs(d/Math.cos(angle));

		  if(which&1){	// handle far end arrow head
		    var angle1=lineangle+Math.PI+angle;
		    var topx=x2+Math.cos(angle1)*h;
		    var topy=y2+Math.sin(angle1)*h;
		    var angle2=lineangle+Math.PI-angle;
		    var botx=x2+Math.cos(angle2)*h;
		    var boty=y2+Math.sin(angle2)*h;
		    toDrawHead(ctx,topx,topy,x2,y2,botx,boty,style);
		  }
		  if(which&2){ // handle near end arrow head
		    var angle1=lineangle+angle;
		    var topx=x1+Math.cos(angle1)*h;
		    var topy=y1+Math.sin(angle1)*h;
		    var angle2=lineangle-angle;
		    var botx=x1+Math.cos(angle2)*h;
		    var boty=y1+Math.sin(angle2)*h;
		    toDrawHead(ctx,topx,topy,x1,y1,botx,boty,style);
		  }
		}


		var drawHead=function(ctx,x0,y0,x1,y1,x2,y2,style)
		{
		  'use strict';
		  if(typeof(x0)=='string') x0=parseInt(x0);
		  if(typeof(y0)=='string') y0=parseInt(y0);
		  if(typeof(x1)=='string') x1=parseInt(x1);
		  if(typeof(y1)=='string') y1=parseInt(y1);
		  if(typeof(x2)=='string') x2=parseInt(x2);
		  if(typeof(y2)=='string') y2=parseInt(y2);
		  var radius=3;
		  var twoPI=2*Math.PI;

		  // all cases do this.
		  ctx.save();
		  ctx.beginPath();
		  ctx.moveTo(x0,y0);
		  ctx.lineTo(x1,y1);
		  ctx.lineTo(x2,y2);
		  switch(style){
		    case 0:
		      // curved filled, add the bottom as an arcTo curve and fill
		      var backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
		      ctx.arcTo(x1,y1,x0,y0,.55*backdist);
		      ctx.fill();
		      break;
		    case 1:
		      // straight filled, add the bottom as a line and fill.
		      ctx.beginPath();
		      ctx.moveTo(x0,y0);
		      ctx.lineTo(x1,y1);
		      ctx.lineTo(x2,y2);
		      ctx.lineTo(x0,y0);
		      ctx.fill();
		      break;
		    case 2:
		      // unfilled head, just stroke.
		      ctx.stroke();
		      break;
		    case 3:
		      //filled head, add the bottom as a quadraticCurveTo curve and fill
		      var cpx=(x0+x1+x2)/3;
		      var cpy=(y0+y1+y2)/3;
		      ctx.quadraticCurveTo(cpx,cpy,x0,y0);
		      ctx.fill();
		      break;
		    case 4:
		      //filled head, add the bottom as a bezierCurveTo curve and fill
		      var cp1x, cp1y, cp2x, cp2y,backdist;
		      var shiftamt=5;
		      if(x2==x0){
			// Avoid a divide by zero if x2==x0
			backdist=y2-y0;
			cp1x=(x1+x0)/2;
			cp2x=(x1+x0)/2;
			cp1y=y1+backdist/shiftamt;
			cp2y=y1-backdist/shiftamt;
		      }else{
			backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
			var xback=(x0+x2)/2;
			var yback=(y0+y2)/2;
			var xmid=(xback+x1)/2;
			var ymid=(yback+y1)/2;

			var m=(y2-y0)/(x2-x0);
			var dx=(backdist/(2*Math.sqrt(m*m+1)))/shiftamt;
			var dy=m*dx;
			cp1x=xmid-dx;
			cp1y=ymid-dy;
			cp2x=xmid+dx;
			cp2y=ymid+dy;
		      }

		      ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x0,y0);
		      ctx.fill();
		      break;
		  }
		  ctx.restore();
		};



		//This Function is used to connect two different div with a dotted line.
		this.connect = function(option) {
			_ctx = _canvas[0].getContext('2d');
			_ctx.beginPath();
			try {
				var _color;
				var _dash;
				var _left = new Object(); //This will store _left elements offset  
				var _right = new Object(); //This will store _right elements offset	
				var _error = (option.error == 'show') || false;
				/*
				option = {
					left_node - Left Element by ID - Mandatory
					right_node - Right Element ID - Mandatory
					status - accepted, rejected, modified, (none) - Optional
					style - (dashed), solid, dotted - Optional	
					horizantal_gap - (0), Horizantal Gap from original point
					error - show, (hide) - To show error or not
					width - (2) - Width of the line
				}
				*/

				if (option.left_node != '' && typeof option.left_node !== 'undefined' && option.right_node != '' && typeof option.right_node !== 'undefined' && $(option.left_node).length > 0 && $(option.right_node).length > 0) {

					//To decide colour of the line
					switch (option.status) {
						case 'accepted':
							_color = '#000';
							break;

						case 'rejected':
							_color = '#e7005d';
							break;

						case 'modified':
							_color = '#bfb230';
							break;

						case 'none':
							_color = 'black';
							break;

						default:
							_color = 'black';
							break;
					}

					//To decide style of the line. dotted or solid
					switch (option.style) {
						case 'dashed':
							_dash = [4, 2];
							break;

						case 'solid':
							_dash = [0, 0];
							break;

						case 'dotted':
							_dash = [4, 2];
							break;

						default:
							_dash = [4, 2];
							break;
					}

					//If left_node is actually right side, following code will switch elements.
					$(option.right_node).each(function(index, value) {
						_left_node = $(option.left_node);
						_right_node = $(value);
						var which = 1;
						if (_left_node.offset().left >= _right_node.offset().left) {
							_tmp = _left_node
							_left_node = _right_node
							_right_node = _tmp;
							which = 2;
						}

						//Get Left point and Right Point
						_left.x = _left_node.offset().left   + (_left_node.outerHeight() / 2);
						_left.y = _left_node.offset().top + (_left_node.outerHeight() / 2);
						_right.x = _right_node.offset().left;
						_right.y = _right_node.offset().top + (_right_node.outerHeight() / 2);

						//Create a group
						//var g = _canvas.group({strokeWidth: 2, strokeDashArray:_dash}); 	

						//Draw Line
						var _gap = option.horizantal_gap || 0;


						_ctx.moveTo(_left.x, _left.y);
						if (_gap != 0) {
							_ctx.lineTo(_left.x + _gap, _left.y);
							_ctx.lineTo(_right.x - _gap, _right.y);
						}
						_ctx.lineTo(_right.x, _right.y);

						if (!_ctx.setLineDash) {
							_ctx.setLineDash = function() {}
						} else {
							// _ctx.setLineDash(_dash);
							//chat-icon4.png
							_ctx.setLineDash(_dash);
						}

						_ctx.lineWidth = option.width || 2;
						_ctx.strokeStyle = _color;
						headerDraw(_ctx,_left.x, _left.y, _right.x, _right.y, '', which )
						// _ctx.arrow(_right.x, _right.x);
						_ctx.stroke();
					});

					//option.resize = option.resize || false;
				} else {
					if (_error) alert('Mandatory Fields are missing or incorrect');
				}
			} catch (err) {
				if (_error) alert('Mandatory Fields are missing or incorrect');
			}
		};

		//It will redraw all line when screen resizes
		$(window).resize(function() {
			_me.redrawLines();
		});
		this.redrawLines = function() {
			_ctx.clearRect(0, 0, $(_parent).width(), $(_parent).height());
			_lines.forEach(function(entry) {
				//alert(JSON.stringify(entry));
				entry.resize = true;
				_me.connect(entry);
			});
		};
		return this;
	};
}(jQuery));
