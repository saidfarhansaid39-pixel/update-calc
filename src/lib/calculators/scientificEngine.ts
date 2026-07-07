export type TokenType = 'NUMBER' | 'OPERATOR' | 'FUNCTION' | 'LPAREN' | 'RPAREN' | 'CONSTANT';

export interface Token {
  type: TokenType;
  value: string;
}

// 1. Tokenizer
export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  // Clean string
  const exp = expression.replace(/\s+/g, '');

  while (i < exp.length) {
    const char = exp[i];

    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < exp.length && /[0-9.]/.test(exp[i])) {
        numStr += exp[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let funcStr = '';
      while (i < exp.length && /[a-zA-Z]/.test(exp[i])) {
        funcStr += exp[i];
        i++;
      }
      if (['pi', 'e'].includes(funcStr.toLowerCase())) {
        tokens.push({ type: 'CONSTANT', value: funcStr.toLowerCase() });
      } else {
        tokens.push({ type: 'FUNCTION', value: funcStr.toLowerCase() });
      }
      continue;
    }

    if (['+', '-', '*', '/', '^', '%'].includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (char === '!') {
      tokens.push({ type: 'OPERATOR', value: '!' });
      i++;
      continue;
    }

    i++; // Fallback
  }

  return tokens;
}

// 2. Parser (Shunting Yard to RPN)
const PRECEDENCE: Record<string, number> = {
  '+': 1, '-': 1,
  '*': 2, '/': 2, '%': 2,
  '^': 3,
  '!': 4
};

export function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER' || token.type === 'CONSTANT') {
      output.push(token);
    } else if (token.type === 'FUNCTION') {
      operators.push(token);
    } else if (token.type === 'OPERATOR') {
      // Handle unary minus
      if (token.value === '-' && (i === 0 || tokens[i-1].type === 'LPAREN' || tokens[i-1].type === 'OPERATOR')) {
        operators.push({ type: 'FUNCTION', value: 'neg' });
      } else {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].type !== 'LPAREN' &&
          ((operators[operators.length - 1].type === 'FUNCTION') || 
           (PRECEDENCE[operators[operators.length - 1].value] >= PRECEDENCE[token.value]))
        ) {
          output.push(operators.pop()!);
        }
        operators.push(token);
      }
    } else if (token.type === 'LPAREN') {
      operators.push(token);
    } else if (token.type === 'RPAREN') {
      while (operators.length > 0 && operators[operators.length - 1].type !== 'LPAREN') {
        output.push(operators.pop()!);
      }
      if (operators.length > 0 && operators[operators.length - 1].type === 'LPAREN') {
        operators.pop(); // discard LPAREN
      }
      if (operators.length > 0 && operators[operators.length - 1].type === 'FUNCTION') {
        output.push(operators.pop()!);
      }
    }
  }

  while (operators.length > 0) {
    output.push(operators.pop()!);
  }

  return output;
}

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// 3. Evaluator
export function evaluateRPN(rpn: Token[], isDeg: boolean = true): number {
  const stack: number[] = [];

  const toRad = (val: number) => isDeg ? val * (Math.PI / 180) : val;
  const fromRad = (val: number) => isDeg ? val * (180 / Math.PI) : val;

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'CONSTANT') {
      if (token.value === 'pi') stack.push(Math.PI);
      else if (token.value === 'e') stack.push(Math.E);
    } else if (token.type === 'OPERATOR') {
      if (token.value === '!') {
        const a = stack.pop() || 0;
        stack.push(factorial(a));
      } else {
        const b = stack.pop() || 0;
        const a = stack.pop() || 0;
        switch (token.value) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(a / b); break;
          case '%': stack.push(a % b); break;
          case '^': stack.push(Math.pow(a, b)); break;
        }
      }
    } else if (token.type === 'FUNCTION') {
      const a = stack.pop() || 0;
      switch (token.value) {
        case 'neg': stack.push(-a); break;
        case 'sin': stack.push(Math.sin(toRad(a))); break;
        case 'cos': stack.push(Math.cos(toRad(a))); break;
        case 'tan': stack.push(Math.tan(toRad(a))); break;
        case 'asin': stack.push(fromRad(Math.asin(a))); break;
        case 'acos': stack.push(fromRad(Math.acos(a))); break;
        case 'atan': stack.push(fromRad(Math.atan(a))); break;
        case 'log': stack.push(Math.log10(a)); break;
        case 'ln': stack.push(Math.log(a)); break;
        case 'sqrt': stack.push(Math.sqrt(a)); break;
        case 'exp': stack.push(Math.exp(a)); break;
        default: stack.push(0);
      }
    }
  }

  return stack[0] || 0;
}

export function evaluateExpression(expression: string, isDeg: boolean = true): number {
  try {
    const tokens = tokenize(expression);
    const rpn = toRPN(tokens);
    return evaluateRPN(rpn, isDeg);
  } catch (e) {
    return NaN;
  }
}
