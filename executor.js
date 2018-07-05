export default class Executor {
    constructor () {
        let self = this;
        this.specialForms = Object.create(null);
        this.specialForms['if'] = function (args, env) {
            if(args.length !== 3)
                throw new SyntaxError('Incorrect count of arguments for operation "if"');
            if(self.evaluate(args[0], env) !== false)
                return self.evaluate(args[1], env);
            return self.evaluate(args[2], env);
        };

        this.specialForms['while'] = function (args, env) {
            if(args.length !== 2)
                throw new SyntaxError('Incorrect count of arguments for operation "while"');

            while(self.evaluate(args[0], env) !== false)
                self.evaluate(args[1], env);

            return false;
        };

        this.specialForms['do'] = function (args, env) {
            let value = false;
            args.forEach(arg => {
                value = self.evaluate(arg, env);
            });
            return value;
        };

        this.specialForms['define'] = function (args, env) {
            if(args.length !== 2 || args[0].type !== 'word')
                throw new SyntaxError('bas use of define');
            let value = self.evaluate(args[1], env);
            env[args[0].name] = value;
            return value;
        };

        this.specialForms['fun'] = function (args, env) {
            if(!args.length)
                throw new SyntaxError('Incorrect body of function');
            let argNames = args.slice(0, args.length - 1).map((expr) => {
                if(expr.type !== 'word')
                    throw new SyntaxError(`Incorrect type of arguments. Expected word but got ${expr.type}`);
                return expr.name;
            });
            let body = args[args.length - 1];
            return function () {
                if(arguments.length !== argNames.length)
                    throw new TypeError('Incorrect count of arguments');
                let localEnv = Object.create(env);
                for(let i = 0; i < arguments.length; i++)
                    localEnv[argNames[i]] = arguments[i];
                return self.evaluate(body, localEnv);
            }
        }
    }

    evaluate (expr, env) {
        switch (expr.type) {
            case "value":
                return expr.value;
            case "word":
                if(expr.name in env)
                    return env[expr.name];
                else
                    throw new ReferenceError('Unknown variable: ' + expr.name);
            case "apply":
                if(expr.operator.type === 'word' && expr.operator.name in this.specialForms)
                    return this.specialForms[expr.operator.name](expr.args, env);
                let op = this.evaluate(expr.operator, env);
                if(typeof op !== 'function')
                    throw new TypeError('Is not a function');
                return op.apply(null, expr.args.map(arg => {
                    return this.evaluate(arg, env);
                }));
        }
    }
}