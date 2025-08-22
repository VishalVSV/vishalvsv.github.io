class BASIC {
    constructor() {
        this.lines = [];
        this.variables = new Map();

        this.precedence = [];
        this.precedence.push({operator: "+", precedence: 2, associativity: "left" });
        this.precedence.push({operator: "-", precedence: 2, associativity: "left" });
        this.precedence.push({operator: "/", precedence: 3, associativity: "left" });
        this.precedence.push({operator: "*", precedence: 3, associativity: "left" });
        this.precedence.push({operator: "^", precedence: 4, associativity: "right" });
    }

    run(code) {
        this.lines = [];

        var raw_lines = code.split(/\r?\n|\r|\n/g);
        for (let raw_line of raw_lines) {
            if (raw_line.trim() == "") {
                continue;
            }

            raw_line = raw_line.trim();
            // console.log(raw_line);

            let tokens = this.tokenize(raw_line);
            if (tokens.err) {
                console.log(tokens.err);
                return;
            }
            if (tokens.length > 0 && (tokens[0].type == "integer" || tokens[0].type == "label")) {
                let duplicate = false;
                let j = 0;
                for (j = 0; j < this.lines.length; j++) {
                    if (this.lines[j].label == tokens[0].value) {
                        duplicate = true;
                        break;
                    }
                }
                if (duplicate) {
                    console.log("Duplicate line label!\n");
                    return;
                }
                this.lines.push({
                    label: tokens[0].value,
                    line: tokens.slice(1),
                    raw_line: raw_line
                });
            } else {
                this.lines.push({
                    label: null,
                    line: tokens,
                    raw_line: raw_line
                });
            }
        }

        // console.log(this.lines);

        let i = 0;

        let isFn = (ident) => {
            if (this.variables.has(ident)) {
                return this.variables.get(ident).type == "fn";
            }
            return false;
        };

        let isVar = (ident) => {
            return this.variables.has(ident);
        };

        let getPrec = (op) => {
            for (let i = 0; i < this.precedence.length; i++) {
                if (this.precedence[i].operator == op) 
                    return this.precedence[i].precedence;
            }
            return null;
        }

        let getAssociativity = (op) => {
            for (let i = 0; i < this.precedence.length; i++) {
                if (this.precedence[i].operator == op) 
                    return this.precedence[i].associativity;
            }
            return null;
        }

        let ensure = (...args) => {
            let j = 1;
            for (let arg of args) {
                if (arg.length == 1) {
                    if (this.lines[i].line[j].type != arg[0]) {
                        return {
                            err: `Expected ${arg[0]} got ${this.lines[i].line[j].type}`
                        };
                    }
                } else if (arg.length == 2) {
                    if (this.lines[i].line[j].type != arg[0]) {
                        return {
                            err: `Expected ${arg[0]} got ${this.lines[i].line[j].type}` 
                        };
                    }
                    if (this.lines[i].line[j].value != arg[1]) {
                        return {
                            err: `Expected ${arg[1]} got ${this.lines[i].line[j].value}` 
                        };
                    }
                }
                j += 1;
            }
            return true;
        };

        let exit_code = 0;
        outer: while (i < this.lines.length) {
            if (this.lines[i].line[0].type == "keyword") {
                if (this.lines[i].line[0].value == "PRINT") {
                    this.print(this.lines[i].line[1].value);
                } else if (this.lines[i].line[0].value == "DIM") {
                    let e = ensure(["identifier"]);
                    if (e.err) {
                        console.log(e.err);
                        exit_code = 1;
                        break outer;
                    }
                    let var_name = this.lines[i].line[1].value;

                    this.variables.set(var_name, {
                        value: null,
                        name: var_name
                    });
                } else if (this.lines[i].line[0].value == "GOTO") {
                    let found = false;
                    for (let j = 0; j < this.lines.length; j++) {
                        if (this.lines[j].label == this.lines[i].line[1].value) {
                            i = j - 1;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        console.log(`Couldn't find label ${this.lines[i].line[1].value}`);
                        exit_code = 1;
                        break outer;
                    }
                } else {
                    console.log("Unknown token\n"+this.lines[i].raw_line);
                    exit_code = 1;
                    break outer;
                }
            } else if (this.lines[i].line[0].type == "identifier") {
                if (!this.variables.has(this.lines[i].line[0].value)) {
                    console.log(`Unknown variable ${this.lines[i].line[0].value}\n${this.lines[i].raw_line}`);
                    exit_code = 1;
                    break outer;
                }

                let e = ensure(["operator", "="]);
                if (e.err) {
                    console.log(e.err);
                    exit_code = 1;
                    break outer;
                }

                let j = 2;
                let operators = [];
                let output = [];
                while (j < this.lines[i].line.length) {
                    if (this.lines[i].line[j].type == "integer" || this.lines[i].line[j].type == "float") {
                        output.push(this.lines[i].line[j]);
                    } else if (this.lines[i].line[j].type == "paren") {
                        if (this.lines[i].line[j].value == "(") {
                            operators.push("(");
                        } else if (this.lines[i].line[j].value == ")") {
                            while (operators[operators.length - 1] != "(") {
                                if (operators.length == 0) {
                                    console.log(`Mismatched parenthesis!\n${this.lines[i].raw_line}`);
                                    exit_code = 1;
                                    break outer;
                                }

                                output.push(operators.pop());
                            }
                            if (operators[operators.length - 1] == "(") {
                                operators.pop();
                            }
                            if (isFn(operators[operators.length - 1])) {
                                output.push(operators.pop());
                            }
                        }
                    } else if (this.lines[i].line[j].type == "comma") {
                        while (operators[operators.length - 1] != "(") {
                            output.push(operators.pop());
                        }
                    } else if (this.lines[i].line[j].type == "operator") {
                        while (operators[operators.length - 1] != "(" && (getPrec(operators[operators.length - 1]) > getPrec(this.lines[i].line[j].value || ((getPrec(operators[operators.length - 1]) == getPrec(this.lines[i].line[j].value)) && getAssociativity(this.lines[i].line[j].value) == "left")))) {
                            output.push(operators.pop());
                        }
                        operators.push(this.lines[i].line[j].value);
                    } else if (this.lines[i].line[j].type == "identifier") {
                        if (isFn(this.lines[i].line[j].value)) {
                            operators.push(this.lines[i].line[j].value);
                        } else if (isVar(this.lines[i].line[j].value)) {
                            output.push(this.variables.get(this.lines[i].line[j].value));
                        }
                    }

                    j++;
                }

                // console.log(operators);
                while (operators.length > 0) {
                    if (operators[operators.length - 1] == "(") {
                        console.log(`Mismatched parenthesis!\n${this.lines[i].raw_line}`);
                        exit_code = 1;
                        break outer;
                    }
                    output.push(operators.pop());
                }

                console.log(output);

                let answer = [];
                for (let k = 0; k < output.length; k++) {
                    if (output[k] == "+") {
                        answer.push(answer.pop() + answer.pop());
                    } else if (output[k] == "-") {
                        let a = answer.pop();
                        let b = answer.pop();
                        answer.push(b - a);
                    } else if (output[k] == "*") {
                        answer.push(answer.pop() * answer.pop());
                    } else if (output[k] == "/") {
                        let a = answer.pop();
                        let b = answer.pop();
                        answer.push(b / a);
                    } else {
                        answer.push(output[k].value);
                    }
                }

                if (answer.length != 1) {
                    console.log(`Error in expression!\n${this.lines[i].raw_line}`);
                    exit_code = 1;
                    break outer;
                }

                this.variables.get(this.lines[i].line[0].value).value = answer[0];
            } else {
                console.log("Unknown token\n"+this.lines[i].raw_line)
                exit_code = 1;
                break outer;
            }
            i++;
        }
    }

    print(a) {
        console.log(a);
    }

    tokenize(line) {
        let tokens = [];
        let i = 0;
        while(i < line.length) {
            if (isLetter(line[i])) {
                let text = "";
                while (i < line.length && isLetter(line[i])) {
                    text += line[i];
                    i++;
                }
                if (line[i] == ':') {
                    tokens.push({
                        type: "label",
                        value: text
                    });
                } else {
                    if (["FOR", "DIM", "TO", "PRINT", "GOTO", "AS"].includes(text.toUpperCase())) {

                        text = text.toUpperCase();
                        tokens.push({
                            type: "keyword",
                            value: text
                        });
                    } else {
                        tokens.push({
                            type: "identifier",
                            value: text
                        });
                    }
                    i--;
                }
            } else if (isDigit(line[i])) {
                let text = "";
                let float = false;
                while (i < line.length && (isDigit(line[i]) || line[i] == '.')) {
                    if (line[i] == '.') {
                        if (float) {
                            return {
                                err: `Too many decimal points!\n${line}\n${" ".repeat(i)}^`
                            };
                        } else {
                            float = true;
                        }
                    }
                    text += line[i];
                    i++;
                }
                i--;
                if (float) {
                    tokens.push({
                        type: "float",
                        value: Number(text)
                    });   
                } else {
                    tokens.push({
                        type: "integer",
                        value: Number(text)
                    });   
                }             
            } else if (["=", "+", "-", "/", "*", "^"].includes(line[i])) {
                tokens.push({
                    type: "operator",
                    value: line[i]
                })
            } else if (["(", ")"].includes(line[i])) {
                tokens.push({
                    type: "paren",
                    value: line[i]
                })
            } else if (line[i] == ",") {
                tokens.push({
                    type: "comma",
                    value: line[i]
                })
            } else if (line[i] == "\"") {
                let text = "";
                i++;
                while (i < line.length && line[i] != "\"") {
                    text += line[i];
                    i++;
                }
                tokens.push({
                    type: "string",
                    value: text
                })
            } else if (line[i] == ' ') {
                  
            } else {
                return {
                    err: `Unknown Token! "${line[i]}"\n${line}\n${" ".repeat(i)}^`
                };
            }
            i++;
        }

        return tokens;
    }
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function isDigit(str) {
    return /^\d+$/.test(str);
}
