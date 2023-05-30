<?php
function loadTemplates($dirPath) {
    $dir = scandir($dirPath);
    foreach ($dir as $dirent) {
        $filePath = $dirPath . DIRECTORY_SEPARATOR . $dirent;
        if (!is_file($filePath)) continue;
        include $filePath;
        echo "\n\n";
    }
}
?>
(() => {
    const markup = `
<?php loadTemplates('dist/templates'); ?>

<app-interface>
    <width-input slot="layout-width" class="layout-width" data-title="Layout width:"></width-input>
    <base-selector slot="base-selector" class="base-selector" data-title="Base selector:"></base-selector>
    <width-input slot="from-width" class="from-width" data-title="From:"></width-input>
    <width-input slot="to-width" class="to-width" data-title="To:"></width-input>
    <check-box slot="use-window-width" class="use-window-width" data-title="Use window width"></check-box>
    <code-container slot="code-container-1" class="input-code" data-title="Input SCSS"></code-container>
    <code-container slot="code-container-2" class="output-code" data-title="Output SCSS"></code-container>
    <check-box slot="settings-check-box" class="check-box-copy-to-clipboard" data-title="Copy result to clipboard"></check-box>
    <check-box slot="settings-check-box" class="check-box-wrap-into-media" data-title="Wrap into @media"></check-box>
    <check-box slot="settings-check-box" class="check-box-add-unlock" data-title="Add unlock"></check-box>
    <check-box slot="settings-check-box" class="check-box-unlock-to-start-value" data-title="Unlock to start value"></check-box>
    <check-box slot="settings-check-box" class="check-box-shake" data-title="Shake"></check-box>
    <calculate-button slot="calculate-button" class="calculate-button"></calculate-button>
</app-interface>
    `;
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, 'text/html');
    [...doc.querySelectorAll('template')].forEach((template) => {
        document.body.appendChild(template);
    });
    document.body.appendChild(doc.querySelector('app-interface'));
})();
