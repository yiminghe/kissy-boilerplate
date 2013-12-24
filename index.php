<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script <?php 
  	if(isset($_GET['dev'])){
  		echo "src='http://g.tbcdn.cn/kissy/k/1.4.1/seed.js'";
  	}else{
  		echo "src='http://g.tbcdn.cn/kissy/k/1.4.1/??seed-min.js,import-style-min.js' data-config='{combine:true}' ";
  	}
  	?>></script>
	<?php 
  	if(!isset($_GET['dev'])){
  		echo "<script src='build/my/modules.js'></script>";
  		echo "<script>KISSY.importStyle('my/index');</script>";
  	}
	?>
</head>
<body>
	<p>a: <input id='a'/></p>
	<p>b: <input id='b'/></p>
	<p>result: <span id='c'></span></p>
	<p><button id='add'>add</button></p>
	<script>
		KISSY.config({
			packages:[{
				name:'my',
				<?php 
			  	if(!isset($_GET['dev'])){
			  		echo "path:'build'";
			  	}else{
			  		echo "path:'src'";
			  	}
		  	?>
		  	
			}]
		});
		KISSY.use('my/index',function(S, my){
			my.init(document.getElementById('a'),document.getElementById('b'),document.getElementById('c'),document.getElementById('add'));
		});
	</script>
</body>
</html>