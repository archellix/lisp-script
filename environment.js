let environment = Object.create(null);
environment['true'] = true;
environment['false'] = false;
['+', '-', '*', '/', '==', '<', '>'].forEach(op => {
    environment[op] = new Function('a, b', 'return a ' + op + ' b;');
});
environment['print'] = function (value) {
    console.log(value);
    return value;
};
export default environment;

