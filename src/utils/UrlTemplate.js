export default class UrlTemplate {
  constructor(template) {
    if (!template) {
      throw new Error(`context must be supplied.`);
    }

    this.template = template;
  }

  expand(context) {
    return UrlTemplate.expandTemplate(this.template, context);
  }

  static expandTemplate(template, context) {
    return template.replace(/\{([^{}]+)\}|([^{}]+)/g, (_, expressionInput, literal) => {
      if (expressionInput) {
        let operator = '';
        let expression = expressionInput;
        const values = [];

        if (UrlTemplate.operators.includes(expression.charAt(0))) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }

        expression.split(/,/g).forEach(variable => {
          const tmp = /([^:*]*)(?::(\d+)|(\*))?/.exec(variable);
          if (tmp === null) {
            return;
          }
          Array.prototype.push.apply(
            values,
            UrlTemplate.getValues(context, operator, tmp[1], tmp[2] || tmp[3])
          );
        });

        if (operator && operator !== '+') {
          let separator = ',';

          if (operator === '?') {
            separator = '&';
          } else if (operator !== '#') {
            separator = operator;
          }
          return (values.length !== 0 ? operator : '') + values.join(separator);
        }
        return values.join(',');
      }
      return UrlTemplate.encodeReserved(literal);
    });
  }

  static isDefined(value) {
    return value !== undefined && value !== null;
  }

  static isKeyOperator(operator) {
    return [';', '&', '?'].includes(operator);
  }

  static encodeReserved(str) {
    return str
      .split(/(%[0-9A-Fa-f]{2})/g)
      .map(part => {
        return /%[0-9A-Fa-f]/.test(part)
          ? part
          : encodeURI(part)
              .replace(/%5B/g, '[')
              .replace(/%5D/g, ']');
      })
      .join('');
  }

  static encodeUnreserved(str) {
    return encodeURIComponent(str).replace(
      /[!'()*]/g,
      c =>
        `%${c
          .charCodeAt(0)
          .toString(16)
          .toUpperCase()}`
    );
  }

  static encodeValue(operator, value, key) {
    const encodedValue =
      operator === '+' || operator === '#'
        ? UrlTemplate.encodeReserved(value)
        : UrlTemplate.encodeUnreserved(value);

    if (key) {
      return `${UrlTemplate.encodeUnreserved(key)}=${encodedValue}`;
    }
    return encodedValue;
  }

  static getValues(context, operator, key, modifier) {
    let value = context[key];
    const result = [];

    if (UrlTemplate.isDefined(value) && value !== '') {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        value = value.toString();

        if (modifier && modifier !== '*') {
          value = value.substring(0, parseInt(modifier, 10));
        }

        result.push(
          UrlTemplate.encodeValue(
            operator,
            value,
            UrlTemplate.isKeyOperator(operator) ? key : undefined
          )
        );
      } else if (modifier === '*') {
        if (Array.isArray(value)) {
          value.filter(UrlTemplate.isDefined).forEach(v => {
            result.push(
              UrlTemplate.encodeValue(
                operator,
                v,
                UrlTemplate.isKeyOperator(operator) ? key : undefined
              )
            );
          });
        } else {
          Object.keys(value).forEach(k => {
            if (UrlTemplate.isDefined(value[k])) {
              result.push(UrlTemplate.encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        var tmp = [];

        if (Array.isArray(value)) {
          value.filter(UrlTemplate.isDefined).forEach(function(value) {
            tmp.push(UrlTemplate.encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (UrlTemplate.isDefined(value[k])) {
              tmp.push(UrlTemplate.encodeUnreserved(k));
              tmp.push(UrlTemplate.encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (UrlTemplate.isKeyOperator(operator)) {
          result.push(UrlTemplate.encodeUnreserved(key) + '=' + tmp.join(','));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(','));
        }
      }
    } else if (operator === ';') {
      if (UrlTemplate.isDefined(value)) {
        result.push(UrlTemplate.encodeUnreserved(key));
      }
    } else if (value === '' && (operator === '&' || operator === '?')) {
      result.push(`${UrlTemplate.encodeUnreserved(key)}=`);
    } else if (value === '') {
      result.push('');
    }
    return result;
  }
}

UrlTemplate.operators = ['+', '#', '.', '/', ';', '?', '&'];
