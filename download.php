<?php

/* 下载成功
	$filename = "test.jpg";
	header('Content-Type:image/gif'); 
	header('Content-Disposition: attachment; filename="'.$filename.'"'); 
	header('Content-Length:'.filesize($filename));
	readfile($filename);
*/
	//下载出错,document.domain = 'xxx.yyy;不同源时需要目标页面和iframe有相同的domain
	echo '<script>frameElement.callback({code:-1,msg:"sss"})</script>';
?> 
