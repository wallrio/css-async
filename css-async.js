/**
 * cssAsync 1.0
 * load style css Asynchronously
 *
 * Wallace Rio <wallrio@gmail.com>
 *
 * 
 */

(function(){
        
	var ajax = function(options){
	    var url = options['url'] || null;
	    var success = options['success'] || null;
	    var error = options['error'] || null;
	    var progress = options['progress'] || null;
	    var data = options['data'] || null;
	    var type = options['type'] || 'post';

	    

	    var xhr = (function(){
	        try{return new XMLHttpRequest();}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP");}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP");}catch(e){}return null;
	    })();
	    
	        xhr.open(type, url, true);

	        if(xhr.upload){
		        xhr.upload.onprogress = function (e) {
		            if (e.lengthComputable) {
		                if(progress)
		                progress(e.loaded,e.total);          
		            }
		        }

		        xhr.upload.onloadstart = function (e) {             
		            if(progress)
		            progress(0,e.total);
		        }
		        xhr.upload.onloadend = function (e) {             
		            if(progress)
		            progress(e.loaded,e.total);
		        }
		        xhr.upload.onprogress = function (e) {
		            if (e.lengthComputable) {
		                var ratio = Math.floor((e.loaded / e.total) * 100) + '%';                        
		            }
		        }
		    }
	        xhr.onreadystatechange = function () {

	            if(xhr.readyState > 3){
	            	if (xhr.status === 404) {  
			            if(error)
	                    	error(xhr.responseText); 
			            return false;
			        }             	
	                if(success)
	                    success(xhr.responseText);              
	            }
	        };

	        
	        var dataForm = new FormData();              
	        for (key in data) {
	            if (data.hasOwnProperty(key)){                                      
	                dataForm.append(key,data[key]);
	            }
	        }
	    	

	        xhr.send(dataForm);
	};


    var insertFor = function(attributes){

    	var container = attributes['container'];
    	var useStyleTag = attributes['use-style-tag'];

        var cssAsyncAll = document.querySelectorAll('[rel="stylesheet-async"]');
        for (var i = 0; i < cssAsyncAll.length; i++) {
            if(cssAsyncAll[i].cssAsyncInit == 1) continue;
            cssAsyncAll[i].cssAsyncInit = 1;

            if(useStyleTag === false){
	            cssAsyncAll[i].rel='stylesheet';
	            cssAsyncAll[i].setAttribute('data-by-css-async','');
	            cssAsyncAll[i].removeAttribute('disabled');
	            var url = cssAsyncAll[i].href;        	
	           console.log('#'+i+' - URL: '+url); 
	        }else{
	        	var url = cssAsyncAll[i].href;        	
	        	(function(url){	   

		        	ajax({
		            	url:url,
		            	success:function(response){
		            		var styleEl = document.createElement('style');
		            		styleEl.setAttribute('href',url);
		            		styleEl.setAttribute('data-by-css-async','');
		            		styleEl.innerHTML = response;
		            		document.querySelector(container).appendChild(styleEl);		
		            		console.log('#'+i+' - URL: '+url);   		            		
		            	}
		            });   
	        	})(url);
	        }
        }
        
    }

    var insertOrder = function(insertOrder,cssAsyncAll,index,attributes){
    	if(cssAsyncAll[index] == null)
    		return false;


    	var container = attributes['container'];
    	var useStyleTag = attributes['use-style-tag'];

    	

    	if(useStyleTag === false){
        	cssAsyncAll[index].rel='stylesheet';
        	cssAsyncAll[index].setAttribute('data-by-css-async','');
        	cssAsyncAll[index].removeAttribute('disabled');
        	var url = cssAsyncAll[index].href;        	
        	console.log('#'+index+' - URL: '+url); 
        	insertOrder(insertOrder,cssAsyncAll,index+1,attributes);
        }else{
        	var url = cssAsyncAll[index].href;        	
        	ajax({
            	url:url,
            	success:function(response){
            		var styleEl = document.createElement('style');
            		styleEl.setAttribute('href',url);
            		styleEl.setAttribute('data-by-css-async','');
            		styleEl.innerHTML = response;
            		document.querySelector(container).appendChild(styleEl);

            		
            		console.log('#'+index+' - URL: '+url); 

            		insertOrder(insertOrder,cssAsyncAll,index+1,attributes);

            	}
            });          	
        }
    }


    var execute = function(attributes){

    	var relOriginal = attributes['rel-original'];
    	var styleDisable = attributes['style-disable'];

    	if(styleDisable === true){    		
	    	var cssAsyncAll = document.querySelectorAll('[rel="stylesheet"]');
	    	for (var i = 0; i < cssAsyncAll.length; i++) {	    		
	    		cssAsyncAll[i].setAttribute('disabled','disabled');	    		
	    		cssAsyncAll[i].parentNode.removeChild(cssAsyncAll[i]);
	    	}

	    	return false;
	    }

	    if(relOriginal === true){
    		
	    	var cssAsyncAll = document.querySelectorAll('[rel="stylesheet"]');
	    	for (var i = 0; i < cssAsyncAll.length; i++) {
	    		cssAsyncAll[i].setAttribute('rel','stylesheet-async');
	    		cssAsyncAll[i].setAttribute('disabled','disabled');
	    	}
	    }

	    var cssAsyncAll = document.querySelectorAll('[rel="stylesheet-async"]');
	    setTimeout(function(){

	    	if(attributes['use-order'] == true)
	    		insertOrder(insertOrder,cssAsyncAll,0,attributes);
	    	else
	    		insertFor(attributes);

	    	console.groupEnd();    
	    	
	    },300);
	}


    var scriptAll = document.querySelectorAll('script');
    var attributes = {
    	'use-style-tag':false,
    	'use-order':true,
    	'container':'body',
    	'rel-original':false,
    	'style-disable':false
    };
    for (var i = 0; i < scriptAll.length; i++) {
    	var src = scriptAll[i].src;
    	if(src.indexOf('css-async.js')!==false){
    		if(scriptAll[i].getAttribute('data-attributes')!= null){
	    		var dataAttributes = scriptAll[i].getAttribute('data-attributes');
	    		var preAttributes = JSON.parse('{'+dataAttributes+'}');		    		
	    		
	    		for(key in preAttributes){
	    			
	    			attributes[key] = preAttributes[key];
	    		}
	    		
	    		break;
    		}
    	}
    }


 	
 	console.info('CSS Async loaded'); 	
 	console.group();
 	execute(attributes);
    
    
})();

    
