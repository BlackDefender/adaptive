<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>

</head>
<body>

<script src="loader.php" defer></script>



<style>
    .test-object{
        background: green;
        width: 100px;
        height: 50px;
    }
</style>
<div class="test-polygon" style="margin-top: 700px">
    <div class="test-object"></div>
</div>
<script>
    const testObject = document.querySelector('.test-object');
    testObject.style.width = '200px';
    testObject.style.height = '100px';



</script>

</body>
</html>
