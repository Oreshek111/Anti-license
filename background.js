chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({
  code: getFunctionCode(replaceText, ['Я принимаю', 'Я соглашаюсь', 'Я согласен'], 'Я не согласен')
  });
});

function getFunctionCode(func, ...args) {
  return `${func};${func.name}(${args.map(transcribeArgument).join(',')});`;
 
  function transcribeArgument(arg) {
    if (Array.isArray(arg)) return `[${arg.map(transcribeArgument).join(',')}]`;
    if (typeof arg === 'string') return `'${arg.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`;
    return arg;
  }
}

function replaceText(textArr, textToReplace) {
  if (!Array.isArray(textArr)) textArr = [textArr];
  const reg = new RegExp(textArr.join('|'), 'gi');
  function replace(nodes) {
    for (let node of nodes) {
      if (node instanceof HTMLScriptElement) continue;
      if (node instanceof HTMLStyleElement) continue;
      if (node instanceof Text) {
        if (node.nodeValue.match(reg)) {
          node.nodeValue = node.nodeValue.replace(reg, textToReplace);
        }
      } else {
        replace(node.childNodes);
      }
    }
  }
  replace(document.body.childNodes);
}