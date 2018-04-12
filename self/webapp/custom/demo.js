var mapObj={
			marker:[]
	}
$(function() {
	
	$('#addSimpleMarker').click(addSimpleMarker) //增加简单marker

	$('#addSimpleMarkericon').click(addSimpleMarkericon)//修该mark图标

	$('#addSimplePopup').click(addSimplePopup)//增加简单的popup

	$('#addSimpleMarkerPopup').click(addSimpleMarkerPopup) //masker上增加popup

	$('#addSimpleMarkerevt').click(addSimpleMarkerevt) //markers事件绑定

	$('#addLineString').click(addLineString) //画线性

	$('#addPoint').click(addPoint) //动态画点

	$('#addLineStringByActual').click(addLineStringByActual)  //动态画轨迹
	
	$('#addPolygonByActual').click(addPolygonByActual)  //动态画多边形

	
	$('#editPolygonByActual').click(editPolygonByActual)  //动态编辑画图

	$('#deleteMark').click(deleteMark)//移除某个点
	
})
//增加简单marker
function addSimpleMarker(){

	//加入简单标注markers已经在func.js中定义
	var lonLat = transformLonLat('120.156185000','30.288419');
	//添加标注图层
	var markers=new OpenLayers.Layer.Markers('danbin1');
	mapObj.marker.push(markers)
	map.addLayer(markers);
	
	var marker0 = new OpenLayers.Marker(lonLat);
	markers.addMarker(marker0);
	/*var time=setTimeout(function() {
		markers.destroy()
	}, 1000);*/
	
	/*var time1=setTimeout(function() {
		addSimpleMarker()
	},1000)*/
	//markers.destroy()
	console.log(marker0);
	console.log(marker0.map);
	/*//加入标注的title提示
	var marker = new OpenLayers.Marker(new OpenLayers.LonLat('13375725.32800046','3539651.6717534177'),
			OpenLayers.Marker.defaultIcon());
	//加入title提示
	marker.icon.imageDiv.title = "hello marker";
	markers.addMarker(marker);*/
	
	//map.zoomToMaxExtent();
}
//移除某个点
function deleteMark(){
	console.log(mapObj.marker)
	//mapObj.marker[0].destroy()
}
//修该mark图标
function addSimpleMarkericon(){
	var markers=new OpenLayers.Layer.Markers('danbin2');
	mapObj.marker.push(markers)
	map.addLayer(markers);
	//修改标注的图标
	var size = new OpenLayers.Size(21,25);
	//alert('111')
	var offset = new OpenLayers.Pixel(-(size.w/2),-size.h);
	var icon = new OpenLayers.Icon('img/marker-gold.png',size,offset);
	
	var marker = new OpenLayers.Marker(
				new OpenLayers.LonLat('13375725.32800046','3539651.6717534177'),
				icon
				);
	marker.icon.imageDiv.title = "hello marker";
	markers.addMarker(marker);
	//map.zoomToMaxExtent();

}
//增加简单的popup
function addSimplePopup() {
	//增加popup
	var popup0=new OpenLayers.Popup("chicken",
			new OpenLayers.LonLat(5,40),
			new OpenLayers.Size(200,200),
			"exe_popup",
			true
			);
	map.addPopup(popup0);
	map.zoomToMaxExtent();

}
//masker上增加popup
function addSimpleMarkerPopup() {

	//增加一个冒泡popup
	/*var popup0 = new OpenLayers.Popup("chicken",
			lonLat,
			new OpenLayers.Size(200,200),
			"hello popup",
			true
			);
		map.addPopup(popup0);*/
		
	//重新新建marker层加入标注层必须要，虽然init中创建了marker层，如果不重新创建会导致事件绑定不上去
	var markers = new OpenLayers.Layer.Markers("Markers");
	map.addLayer(markers);
	var lonLat = transformLonLat('120.156185000','30.288419');

	var popup = new OpenLayers.Popup.Anchored("Example",
			lonLat,
			new OpenLayers.Size(200,200),
			"Welcome to ...");
	
	map.addPopup(popup);
	popup.hide();
	
	//绑定冒泡给一个标注
	var marker = new OpenLayers.Marker(lonLat);
	markers.addMarker(marker);
	
	marker.events.register("click",marker,function(e){popup.toggle()});
	//map.zoomToMaxExtent();
}
//markers事件绑定
function addSimpleMarkerevt(){
	//加marker首先加一个标注层
	var markers=new OpenLayers.Layer.Markers('Markers');
	map.addLayer(markers);
	//定义标注点击后处理冒泡的函数
	   function markerClick(evt) {
		if( this.popup == null ){
			this.popup = this.createPopup(this.closeBox);
			map.addPopup(this.popup);
			this.popup.show();			
		} else {			
			this.popup.toggle();			
		}
		OpenLayers.Event.stop(evt);
	}
	//构建一个标注+冒泡，并且绑定事件
	var lonLat = transformLonLat('120.156185000','30.288419');

	var marker0=new OpenLayers.Marker(lonLat);//生成marker0
	markers.addMarker(marker0);
	
	//构建popup
	var popup=new OpenLayers.Popup.FramedCloud('c',
			lonLat,
			null,
			'hello 0',
			null,
			true,
			null);
	marker0.popup= popup; //popup绑定到marker0上
	map.addPopup(popup); //popup加到地图上
	popup.hide();
	//marker0上的事件绑定
	marker0.events.register('click',marker0,markerClick);
	
	//使用featrue修改popup样式
	var lonLat11 = transformLonLat('120.166185000','30.298419');
	
	var feature=new OpenLayers.Feature(markers,lonLat11);
	feature.closeBox=true;
	feature.popupClass=OpenLayers.Class(OpenLayers.Popup.FramedCloud,
			{"autoSize":true});
	feature.data.popupContentHTML='hello1 hello2 hello3 hello4 hello5 hello6 hello7 hello8 hello9';
	feature.data.overflow="auto";
	var marker = new OpenLayers.Marker(lonLat11);
	marker.icon.imageDiv.title = "hello marker";
	markers.addMarker(marker);
	marker.events.register("mousedown",feature,markerClick);
	
	
	//定义另一种效果
	var lonLat22 = transformLonLat('120.186185000','30.308419');

	
	var feature1 = new OpenLayers.Feature(markers,lonLat22);
	feature1.closeBox = false;	//没有关闭按钮
	feature1.popupClass = OpenLayers.Class(OpenLayers.Popup.Anchored,
			{
				'autoSize':true,
				'minSize':new OpenLayers.Size(40,40)
			});
	feature1.data.popupContentHTML = "hello22222222222222222";
	feature1.data.overflow = "hidden";	
	var marker1 = new OpenLayers.Marker(lonLat22);
	marker1.icon.imageDiv.title="hello1 marker1";
	markers.addMarker(marker1);	
	marker1.events.register("mousedown",feature1,markerClick);
	
	//定义一个map移动popup消失的函数
	var mapmove=function(evt){
		if(this.popups!=null){
			for(var i=0;i<this.popups.length;i++){
				this.popups[i].hide();
			}
		}
		OpenLayers.Event.stop(evt);
	}
	//地图移动popup就消失
	map.events.register('move',map,mapmove);
	
	//加载图层的时候触发addlayer事件
	map.events.register('addlayer',map,function(){
		console.log('addlayer')
	})
	
	//加入层切换工具条
	map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));
	var wms = new OpenLayers.Layer.WMS("WMS","http://vmap0.tiles.osgeo.org/wms/vmap0");
	map.addLayer(wms);
	map.events.register("changebaselayer",map,function(e){console.log("changebaselayer")});
	//map.zoomToMaxExtent();
}


//画线性
function addLineString(){
	//构造点数据
	var points=[];
	for(var i=0;i<10;i++){
		var oPoint=new OpenLayers.Geometry.Point((1000000*i)-29351,3776600-(100000*i));
		points.push(oPoint);
	}
	//新建一个vector矢量层，所有的划线必须在vector中
	var polygonLayer=new OpenLayers.Layer.Vector('Polygon Layer');
	//矢量层添加到地图上
	map.addLayer(polygonLayer);
	//构建并且绘制线形
	var oLine=new OpenLayers.Geometry.LineString(points);
	var fea=new OpenLayers.Feature.Vector(oLine);
	fea.style={
			strokeColor:'#ff0000',
			strokeWidth:3
	}
	//矢量层添加样式
	polygonLayer.addFeatures([fea]);
	//视图扩展到最大使得标记可见
	map.zoomToMaxExtent();
}



//动态画点
function addPoint(){
	//修改图层样式
	var styleMap=new OpenLayers.StyleMap({
		"default":{
			fillOpacity:1,
			strokeOpacity:1,
			strokeColor:'#000000',
			graphicWidth:30,
			graphicHeight:50,
			externalGraphic:"../Icons/lightblue5.png"
		}
	})
	
	//创建一个点图层，用来展现我们从后台获取的点信息
	var vector_point = new OpenLayers.Layer.Vector("style vector",{
		styleMap:styleMap,
		rendererOptions:{zIndexing:true}		
	});
	
	//将地图和点图层加载到map
	map.addLayers([vector_point]);
	var i=0;
	var step=1000000;
	function move() {
		vector_point.removeAllFeatures();
		//vector_point.clearMarkers()
		i=i+step;
		//使用ajax从后台获取json
		var jsons = {"type":"FeatureCollection",
				 "features":[{
					 "type":"Feature",
					 "geometry":{
						 "type":"Point",
						 "coordinates":[5,43]
					 }
				 	},{
						 "type":"Feature",
						 "geometry":{
							 "type":"Point",
							 "coordinates":[i,4300000]
						 }					 
					 },{
						 "type":"Feature",
						 "geometry":{
							 "type":"Point",
							 "coordinates":[5,i]
						 }					 
					 }
					 ]
				};
		//拿到数据后就通过addJSON加载到地图上
		vector_point.addFeatures(geojson.read(jsons));
		console.log(vector_point);
	}
	
	var t=setInterval(move,1000);
	map.zoomToMaxExtent();

}



//动态画轨迹
function addLineStringByActual() {
	//创建绘图层，用来展示我们从后台拿到的轨迹动画数据
	var vector_point = new OpenLayers.Layer.Vector();
	//将地图和点图层加载到map
	map.addLayers([vector_point]);
	var i = 0;
	var step =1000000;
	var data ={};
	function move(){
		i=i+step;
		
		//通过ajax调用服务端获取geojson数据,demo中模拟假设得到了返回的数据
		data= {
				"type":"FeatureCollection",
				"features":[{
					"type":"Feature",
					"geometry":{
						"type":"LineString",
						"coordinates":[
						               [(i-step),(i-step)],
						               [i,i]
						               ]
					}
				}]
		};
		
		//通过OpenLayers.Format.GeoJSON处理服务器提供的GeoJson串
		var features = geojson.read(data,"FeatureCollection");
		console.log('features'+features);
		console.log(features);
		if (features){
			//将结果展示在地图上
			vector_point.addFeatures(features);
		}
	}
	var t = setInterval(move,1000);
	map.zoomToMaxExtent();

}

//动态画多边形
function  addPolygonByActual() {
	//定义允许Canvas的renderers “?renderer=Canvas”
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
	
	//层样式，我们可以扩展 并自定义样式
	var layer_style = OpenLayers.Util.extend({},
			OpenLayers.Feature.Vector.style["default"]			
	);	
	layer_style.fillOpacity = 0.1; //填充的透明度
	layer_style.graphicOpacity = 0.5;//图片透明度
	
	//蓝色的五角星的样式
	var style_bule=OpenLayers.Util.extend({},layer_style);
	style_bule.strokeColor='blue';
	style_bule.fillColor='bule';
	style_bule.graphicName="star";
	style_bule.pointRadius=40;
	style_bule.strokeWidth=1; 
	style_bule.rotation=45;
	style_bule.strokeLinecap="bule";
	
	//绿样式 点线
	var style_green = {
			strokeColor:"#00FF00",
			strokeWidth:3,
			strokeDashstyle:"dashdot",
			pointRadius:20,
			pointerEvents:"visiblePainted"
	};
	
	//标注样式
	var style_mark=OpenLayers.Util.extend({},layer_style);
	style_mark.graphicWidth=40;
	style_mark.graphicHeight=30;
	style_mark.graphicXOffset=style_mark.graphicWidth/2; //style_mark.graphicWidth/2
	style_mark.graphicYOffset=-style_mark.graphicHeight;
	style_mark.externalGraphic = "img/marker.png";
	//title
	style_mark.graphicTitle = "this is a tooltip";
	
	//构建绘图层
	var vectorLayer=new OpenLayers.Layer.Vector('vector',{
		style:layer_style,
		renderers:renderer
	})
	map.addLayer(vectorLayer);
	//构建点
	var point=new OpenLayers.Geometry.Point(0,45);
	var pointFeature=new OpenLayers.Feature.Vector(point,null,style_green);
	var point2=new OpenLayers.Geometry.Point(-10500,3776600);
	var pointFeature2=new OpenLayers.Feature.Vector(point2,null,style_bule);
	var point3=new OpenLayers.Geometry.Point(-200,3776600);
	var pointFeature3=new OpenLayers.Feature.Vector(point3,null,style_mark);
	
	//画线
	var pointList = [];
	var newPoint = point;
	for(var p=0;p<15;++p){		
		newPoint = new OpenLayers.Geometry.Point(newPoint.x + (Math.random(1)*1000000),
										newPoint.y + (Math.random(1)*1000000)		
								);
		pointList.push(newPoint);
	}
	var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointList),null,style_green);
	
	//画多边形,缺省样式
	var points = [];
	for(var p=0;p<6;++p){
		var a = p*(2*Math.PI)/7;
		var r = Math.random(1)*10000000;
		var newPoint = new OpenLayers.Geometry.Point(-1000000+point.x+(r*Math.cos(a)),
													-1000000+point.y+(r*Math.sin(a))
		);		
		points.push(newPoint);		
	}
	points.push(points[0]);
	var linearRing = new OpenLayers.Geometry.LinearRing(points);
	var polygonFeature = new OpenLayers.Feature.Vector(
								new OpenLayers.Geometry.Polygon([linearRing])		
	);
	
	
	vectorLayer.addFeatures([pointFeature,pointFeature2,pointFeature3,lineFeature,polygonFeature]);
	
	map.zoomToMaxExtent();
}

function editPolygonByActual(){
	//加入绘图层
	var vlayer=new OpenLayers.Layer.Vector('Editable');
	map.addLayer(vlayer);
	//加入绘图工具条
	map.addControl(new OpenLayers.Control.EditingToolbar(vlayer));
	//加入绘图工具条
	var container = document.getElementById("panel");
	map.addControl(new OpenLayers.Control.EditingToolbar(vlayer,{div:container}));
	map.zoomToMaxExtent();
}

