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

<style id="test-style">
    .test-object{
        --space: 10px;
        background: green;
        color: white;
        width: 100px;
        height: 2em;
        font-size: 16.5px;
        padding: var(--space);
        margin: 2em;
    }
    .not-found-element{
        width: 1000px;
    }
</style>
<div class="test-polygon" style="margin-top: 700px">
    <div class="test-object">Test</div>
    <div class="not-found-element"></div>
</div>
<script>
    const testObject = document.querySelector('.test-object');
    testObject.style.width = '200px';
    testObject.style.height = '4em';
    testObject.style.fontSize = '25px';
    testObject.style.margin = '2em';

    window.addEventListener('load', () => {
        document.querySelector('.input-code').value = document.getElementById('test-style').textContent.trim();
        document.querySelector('.calculate-button').click();
    });
</script>

</body>
</html>
