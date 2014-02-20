<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script <?php 
      if(isset($_GET['concat']) || isset($_GET['combo'])){
          if(isset($_GET['min'])){
            echo "src='http://g.tbcdn.cn/kissy/k/1.4.1/??seed-min.js,import-style-min.js' data-config='{combine:true}' ";
          }else{
            echo "src='http://g.tbcdn.cn/kissy/k/1.4.1/??seed.js,import-style.js' data-config='{combine:true}' ";
          }
      } else {
          echo "src='http://g.tbcdn.cn/kissy/k/1.4.1/seed.js'";
      }
      ?>></script>
    <script>
        KISSY.config({
            packages:[{
                name:'my',
                <?php 
                  if(isset($_GET['concat'])){
                      echo "path:'build-concat'";
                  } else if(isset($_GET['combo'])){
                      echo "path:'build-combo'";
                  } else{
                      echo "path:'src'";
                  }
              ?>
              
            }]
        });
    </script>  
    <?php 
      if(isset($_GET['concat'])){
          echo "<script src='build-concat/my/modules.js'></script>";
          echo "<script>KISSY.importStyle('my/index');</script>";
      } else if(isset($_GET['combo'])){
          echo "<script src='build-combo/my/modules.js'></script>";
          echo "<script>KISSY.importStyle('my/index');</script>";
      }
    ?>
</head>
<body>
    <script>
        KISSY.use('my/',function(S, my){
            my.init();
        });
    </script>
</body>
</html>