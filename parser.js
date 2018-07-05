export default class Parser {
    constructor() {}
    parseExpression (program) {
        program = this.skipSpace(program);
        let match, expr;
        if(match = /^"([^"]*)"/i.exec(program))
            expr = {type: "value", value: match[1]};
        else if (match = /^\d+\b/.exec(program))
            expr = {type: "value", value: Number(match[0])};
        else if (match = /^[^\s(),"]+/.exec(program))
            expr = {type: "word", name: match[0]};
        else
            throw new SyntaxError("Unknown syntax expression: " + program);

        return this.parseApply(expr, program.slice(match[0].length));
    }

    skipSpace (string) {
        let first = string.search(/\S/);
        if(first === -1) return '';
        return string.slice(first);
    }

    parseApply (expr, program) {
        program = this.skipSpace(program);
        if(program[0] !== '(')
            return {expr: expr, rest: program};
        program = this.skipSpace(program.slice(1));
        expr = {type:'apply', operator: expr, args: []};
        while(program[0] !== ')') {
            let arg = this.parseExpression(program);
            expr.args.push(arg.expr);
            program = this.skipSpace(arg.rest);
            if(program[0] === ',')
                program = this.skipSpace(program.slice(1));
            else if(program[0] !== ')')
                throw new SyntaxError('Expected "," or ")" only!');
        }
        return this.parseApply(expr, program.slice(1));
    }

    parse (program) {
        let result = this.parseExpression(program);
        if(this.skipSpace(result.rest).length > 0)
            throw new SyntaxError("Unexpected end of program");
        return result.expr;
    }
}
