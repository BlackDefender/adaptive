const textToClipboard = text => {
    const outputElement = document.createElement('textarea')
    outputElement.value = text
    outputElement.style.position = 'fixed'
    outputElement.style.height = '100px'
    outputElement.style.top = '-1000px'
    document.body.appendChild(outputElement)
    outputElement.select()
    document.execCommand('copy')
    document.body.removeChild(outputElement)
}

export default textToClipboard
