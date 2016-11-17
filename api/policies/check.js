module.exports = function check(req, res, next) {
    console.log("Check is Called");
    next({
        name: "Json"
    });

};
