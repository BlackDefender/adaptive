<?php
header('Content-Type: application/javascript');

$baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') .'://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].dirname($_SERVER['SCRIPT_NAME']).'/';

echo '(() => {';

echo 'const baseUrl = "' . $baseUrl . '";';

include 'markup.php';

include 'src/js/components/BaseComponent.js';
include 'src/js/components/WidthInput.js';
include 'src/js/components/CodeContainer.js';
include 'src/js/components/CheckBox.js';
include 'src/js/components/CalculateButton.js';
include 'src/js/components/BaseSelector.js';
include 'src/js/components/AppInterface.js';

include 'dist/js/app.js';

echo '})();';
