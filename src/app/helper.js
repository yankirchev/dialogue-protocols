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
      formattedText += `${translate(justification)}. \n`
    } else if (index === justifications.length - 1) {
      formattedText += `${translate(justification)}. \n`
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
  if (term.includes('X')) {
    return term;
  } else {
    let translation = decamelise(term.match(/([A-Za-z0-9])+/g)[1]) + ' has property ' + term.match(/([A-Za-z0-9])+/g)[0];

    if (term.match(/([A-Za-z0-9])+/g)[2])
      translation += ' of value ' + term.match(/([A-Za-z0-9])+/g)[2];
    if (term.match(/([A-Za-z0-9])+/g)[3])
      translation += ' and cost ' + term.match(/([A-Za-z0-9])+/g)[3];

    return translation;
  }
}

export {
  camelise,
  decamelise,
  format,
  translate
};
