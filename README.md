# CSS Async
load css Asynchronously

## Usage

include the script on your head document

	<script  src="css-async.js" async></script>

### Example recomended:

	<script  src="css-async.js" data-attributes='"container":"head","use-order":true,"use-style-tag":false' async></script>


set your style tags with rel="stylesheet-async"

###	Example:

	<link rel="stylesheet-async" href="style.css">


## Async modes compativle

async and defer


For use defer set like above:

	<script  src="css-async.js" defer></script>


## Use Attributes
	
Insert a tag named 'data-attributes', the parameters is like JSON

### Example:

	<script  src="css-async.js" data-attributes='"container":"head","use-order":true,"use-style-tag":true' async></script>

### List of attribute:

	container		=	query identification of element 				example: body|#idelement
	use-order		=	define if the files css will request in order 	example: true|false
	use-style-tag	=	define if will be used the tag <style>			example: true|false
	rel-original	=	use the tags style with rel 'stylesheet'		example: true|false
	style-disable	=	disable the tags styles on document				example: true|false




## Javascript

### defer on script inline

Insert type text/javascript-defer on script tag for load on mode defer

	<script type="text/javascript-defer">
		// javascript code
	</script>