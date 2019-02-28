function camelise(string) {
  return string.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) {
      return '';
    }

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
      formattedText += `${translate(justification)}`;
    } else if (index === justifications.length - 1) {
      formattedText += `${translate(justification)}`;
    } else if (index !== justifications.length - 2) {
      formattedText += `${translate(justification)}, `;
    } else if (justifications.length >= 3 && index === justifications.length - 2) {
      formattedText += `${translate(justification)}, and `;
    } else if (justifications.length < 3 && index === justifications.length - 2) {
      formattedText += `${translate(justification)} and `;
    }
  }

  return formattedText;
}

function translate(term) {
  const restaurant = term.match(/([A-Za-z0-9_])+/g)[1];
  const property = term.match(/([A-Za-z0-9])+/g)[0];
  const value = term.match(/([A-Za-z0-9_])+/g)[2];
  const cost = term.match(/([A-Za-z0-9_])+/g)[3];

  let translation = '';

  if (restaurant !== '_') {
    if (term.includes('\\+(')) {
      translation = `${decamelise(restaurant)} lacks property ${decamelise(property)}`;
    } else {
      translation = `${decamelise(restaurant)} has property ${decamelise(property)}`;
    }
  } else {
    translation = `property ${decamelise(property)}`;
  }

  if (value && value !== '_') {
    translation += ` of value ${decamelise(value)}`;

    if (cost && cost !== '_') {
      translation += ` and cost ${decamelise(cost)}`;
    }
  } else if (cost && cost !== '_') {
    translation += ` of cost ${decamelise(cost)}`;
  }

  return translation;
}

export {
  camelise,
  decamelise,
  format,
  translate
};
