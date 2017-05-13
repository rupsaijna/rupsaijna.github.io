$data = $_POST['imgData'];
$file = "/path/to/file.png";
$uri =  substr($data,strpos($data,",")+1);
file_put_contents($file, base64_decode($uri));
echo $file;
