const uglifyJS = require('uglify-js')
const fs = require('fs')
const path = require('path')
function getFileList(dir, endwith) {
    let results = []
    const files = fs.readdirSync(dir)
    files.forEach(function (item, index) {
        let stat = fs.lstatSync(dir + '/' + item)
        if (stat.isDirectory() === false && path.extname(item)) {
            results.push(item)
        }
    })
    return results;
}
function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = {
    build() {
        console.log("Building library, Please wait....")
        //deleteFolderRecursive(process.cwd()+'/build')
        if(!fs.existsSync(process.cwd()+'/build')){
            fs.mkdirSync(process.cwd()+'/build')
        }
        if(!fs.existsSync(process.cwd()+'/build/output')){
            fs.mkdirSync(process.cwd()+'/build/output')
        }
        console.log("Step 1: Make bundle")
        if(fs.existsSync(process.cwd()+'/src/bundle')){
            let js_files = getFileList(process.cwd()+'/src/bundle')
            let result = '';
            for(let js_file of js_files){
                let res = uglifyJS.minify(fs.readFileSync(process.cwd()+'/src/bundle/'+js_file, "utf8"),{mangle: false})
                result += res.code + '\n'
            }
            
            fs.writeFileSync(process.cwd()+'/build/output/bundle.js',result)
        }else{
            console.log("Skip make bundle, because ./src/bundle doesn't exists.")
        }
        console.log("Step 2: Make blocks.js")
        if(fs.existsSync(process.cwd()+'/src/blocks')){
            let js_files = getFileList(process.cwd()+'/src/blocks')
            let result = '';
            for(let js_file of js_files){
                let res = uglifyJS.minify(fs.readFileSync(process.cwd()+'/src/blocks/'+js_file, "utf8"),{mangle: false})
                result += res.code + '\n'
            }
            fs.writeFileSync(process.cwd()+'/build/output/blocks.js',result)
        }else{
            console.log("Skip make blocks.js, because ./src/blocks doesn't exists.")
        }
        console.log("Step 3: Copy resources")
        if(fs.existsSync(process.cwd()+'/src/resources')){

            let _files = getFileList(process.cwd()+'/src/resources')
            for(let file of _files){
                fs.copyFileSync(process.cwd()+'/src/resources/'+file, process.cwd()+'/build/output/'+file)
            }
        }else{
            console.log("Skip Copy resources, because ./src/resources doesn't exists.")
        }
        fs.copyFileSync(process.cwd()+'/info.json',process.cwd()+'/build/output/info.json')
    },
    create(name){
        let re = /^[\u4E00-\u9FA5A-Za-z0-9_\-]+$/
        if(!re.test(name)){
            console.log("Unable to create library, because project name invild!")
            return;
        }
        let info = {
            name:name,
            author:'',
            version:''
        }

        let info_json = JSON.stringify(info, null, "\t");
        //Create file
        //mkdir
        console.log("Step 1:Make dirs");
        if(fs.existsSync(process.cwd()+'/'+name)&&fs.lstatSync(process.cwd()+'/'+name).isDirectory()){
            console.log("ERROR:Unable to create library, because the directory already exists!")
            return;
        }
        fs.mkdirSync(process.cwd()+'/'+name);
        fs.mkdirSync(process.cwd()+'/'+name+'/src');
        fs.mkdirSync(process.cwd()+'/'+name+'/src/bundle');
        fs.mkdirSync(process.cwd()+'/'+name+'/src/blocks');
        fs.mkdirSync(process.cwd()+'/'+name+'/src/resources');
        //Write info.json
        console.log("Step 2:Write info.json");
        fs.writeFileSync(process.cwd()+'/'+name+'/info.json',info_json);
        console.log("Done!");
    }
}