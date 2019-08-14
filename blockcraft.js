#!/usr/bin/env node
const args = process.argv;
const libraryBuilder = require('./libraryBuilder')

console.log("Welcome use BlockCraft developer tools!");
if(args.length===2){
    printHelpText();
    return
}
if("build"===args[2]){
    libraryBuilder.build();
    return;
}
if(args.length===4&&"create"===args[2]){
    libraryBuilder.create(args[3]);
    return
}
printHelpText();


function printHelpText(){
    console.log("Usage: blockcraft <args>")
    console.log("   build  Build library")
    console.log("   create <name>  Create an empty library")
}