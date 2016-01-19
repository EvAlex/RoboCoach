var reactTemplates = require('react-templates/src/reactTemplates');
var url = require('url');
var queryString = require('querystring');
var fs = require("fs");
var path = require("path");

function addStateInterfaceRequire(js, rtPath) {
    var rtPathParsed = path.parse(rtPath),
        componentName = rtPathParsed.name.replace(".rt", ""),
        componentPath = path.join(rtPathParsed.dir, componentName + ".tsx"),
        stateInterfaceModuleName = "I" + componentName + "State.ts",
        stateInterfaceModulePath = path.join(rtPathParsed.dir, stateInterfaceModuleName);
    if (!fileExists(componentPath)) {
        throw new Error("Naming mismatch.\n\
                            Please, give component's template (.rt.html file) the same name as the component.\n\
                            For example, if you have component \"Calculator.tsx\", create \"Calculator.rt.html\" template for it at the same folder.\n\
                            Searched for file: \"" + componentPath + "\"");
    }
    if (!fileExists(stateInterfaceModulePath)) {
        throw new Error('Module not found.\n\
                            File "' + stateInterfaceModulePath + '" not found.\n\
                            Create this file and place interface for component state there.');
    }

    var insertAfter = "import _ = require('lodash');",
        index = js.indexOf(insertAfter) === -1 ? 0 : js.indexOf(insertAfter) + insertAfter.length;
    return js.substring(0, index) + '\n\nimport IState from "./' + stateInterfaceModuleName + '";\n\n' + js.substring(index);
}

function addTestTemplateTypingClass(js) {
    var classStart = '\n\
class TemplateTypingCheck extends React.Component<{}, IState> {\n\
        render(): React.ReactElement<{}> {\n\
            ',
        classEnd = '\n\
        }\n\
}\n\
export = new TemplateTypingCheck().render();\n',
        fn = js.substring(js.indexOf("var fn = function() {") + 21, js.lastIndexOf("}")) + ";",
        classCode = classStart + fn + classEnd,
        insertIndex = js.indexOf("var fn = function() {") - 2;
    return js.substring(0, insertIndex) + "\n" + classCode;
}

function fileExists(path) {
    try {
        fs.accessSync(path, fs.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = function(source) {
    //console.log("=====> convertRT:", reactTemplates.convertRT);
    //console.log("=====> convertJSRTToJS:", reactTemplates.convertJSRTToJS);
    //console.log("=====> this:", this.resourcePath);
	var options = queryString.parse(url.parse(this.query).query);
	this.cacheable && this.cacheable();

    //console.log("===> emitting");
    var js = reactTemplates.convertRT(source, {}, { modules: "typescript" });
    js = js.replace("import React = require('react/addons');", "import React = require(\"react\");");
    //js = js.replace("var fn = function()", "var fn: () => React.ReactElement<{}> = () => ");
    js = addStateInterfaceRequire(js, this.resourcePath);
    js = addTestTemplateTypingClass(js);
    var jsrtPath = this.resourcePath + ".jsrt.ts";
    fs.writeFileSync(jsrtPath, js);
    //console.log("===> emit complete");
    this.resourcePath = jsrtPath;

	return js;
};
