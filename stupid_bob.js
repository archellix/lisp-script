import Parser from './parser.js';
import Executor from './executor.js';
import environment from './environment.js';

let parser = new Parser();
let executor = new Executor();

function run() {
    let env = Object.create(environment);
    let program = Array.prototype.slice
        .call(arguments, 0).join("\n");
    let expr = parser.parse(program);
    console.dir(expr);
    return executor.evaluate(expr, env);
}

//binding for example
let seyBobDoSomething = document.getElementById('stupid_bob_button');
seyBobDoSomething.addEventListener('click', (e) => {
    let bobTodo = document.getElementById('stupid_bob_receiver').value;
    run(bobTodo);
});