function camelise(string) {
  return string.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0)
      return ""; // or if (/\s+/.test(match)) for white spaces

    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function decamelise(string) {
  return string
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
    .toLowerCase();
}

function format(justifications) {
  let formattedText = '';

  for (const [index, justification] of justifications.entries()) {
    if (justifications.length === 1) {
      formattedText += `${translate(justification)}`
    } else if (index === justifications.length - 1) {
      formattedText += `${translate(justification)}`
    } else if (index !== justifications.length - 2) {
      formattedText += `${translate(justification)}, `
    } else if (justifications.length >= 3 && index === justifications.length - 2) {
      formattedText += `${translate(justification)}, and `
    } else if (justifications.length < 3 && index === justifications.length - 2) {
      formattedText += `${translate(justification)} and `
    }
  }

  return formattedText;
}

function translate(term) {
  let translation = '';

  if (term.includes('\\+('))
    translation = `${decamelise(term.match(/([A-Za-z0-9_])+/g)[1])} lacks property ${decamelise(term.match(/([A-Za-z0-9])+/g)[0])}`;
  else
    translation = `${decamelise(term.match(/([A-Za-z0-9_])+/g)[1])} has property ${decamelise(term.match(/([A-Za-z0-9])+/g)[0])}`;

  if (term.match(/([A-Za-z0-9_])+/g)[2] && term.match(/([A-Za-z0-9_])+/g)[2] !== '_') {
    translation += ` of value ${decamelise(term.match(/([A-Za-z0-9_])+/g)[2])}`;

    if (term.match(/([A-Za-z0-9_])+/g)[3] && term.match(/([A-Za-z0-9_])+/g)[3] !== '_')
      translation += ` and cost ${decamelise(term.match(/([A-Za-z0-9_])+/g)[3])}`;
  } else if (term.match(/([A-Za-z0-9_])+/g)[3] && term.match(/([A-Za-z0-9_])+/g)[3] !== '_')
    translation += ` of cost ${decamelise(term.match(/([A-Za-z0-9_])+/g)[3])}`;

  return translation;
}

export {
  camelise,
  decamelise,
  format,
  translate
};
