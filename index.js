/**
 * Created by mao on 10.08.2016.
 */
require("babel-register");
var mainBowerFiles = require('main-bower-files');


console.log(mainBowerFiles(/.*bootstrap.*\.scss/));