"use strict";
var typescript = require('typescript');
var path = require('path');
var fs = require('fs');
var os = require('os');
var loaderUtils = require('loader-utils');
var objectAssign = require('object-assign');
var arrify = require('arrify');
var makeResolver = require('./resolver');
var Console = require('console').Console;
var semver = require('semver');
require('colors');
var console = new Console(process.stderr);
var pushArray = function (arr, toPush) {
    Array.prototype.splice.apply(arr, [0, 0].concat(toPush));
};
function hasOwnProperty(obj, property) {
    return Object.prototype.hasOwnProperty.call(obj, property);
}
var instances = {};
var webpackInstances = [];
var scriptRegex = /\.tsx?$/i;
function formatErrors(diagnostics, instance, merge) {
    return diagnostics
        .filter(function (diagnostic) { return instance.loaderOptions.ignoreDiagnostics.indexOf(diagnostic.code) == -1; })
        .map(function (diagnostic) {
            var errorCategory = instance.compiler.DiagnosticCategory[diagnostic.category].toLowerCase();
            var errorCategoryAndCode = errorCategory + ' TS' + diagnostic.code + ': ';
            var messageText = errorCategoryAndCode + instance.compiler.flattenDiagnosticMessageText(diagnostic.messageText, os.EOL);
            if (diagnostic.file) {
                var lineChar = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                return {
                    message: "" + '('.white + (lineChar.line + 1).toString().cyan + "," + (lineChar.character + 1).toString().cyan + "): " + messageText.red,
                    rawMessage: messageText,
                    location: { line: lineChar.line + 1, character: lineChar.character + 1 },
                    loaderSource: 'ts-loader'
                };
            }
            else {
                return {
                    message: "" + messageText.red,
                    rawMessage: messageText,
                    loaderSource: 'ts-loader'
                };
            }
        })
        .map(function (error) { return objectAssign(error, merge); });
}
function findConfigFile(compiler, searchPath, configFileName) {
    while (true) {
        var fileName = path.join(searchPath, configFileName);
        if (compiler.sys.fileExists(fileName)) {
            return fileName;
        }
        var parentPath = path.dirname(searchPath);
        if (parentPath === searchPath) {
            break;
        }
        searchPath = parentPath;
    }
    return undefined;
}
function ensureTypeScriptInstance(loaderOptions, loader) {
    function log() {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i - 0] = arguments[_i];
        }
        if (!loaderOptions.silent) {
            console.log.apply(console, messages);
        }
    }
    if (hasOwnProperty(instances, loaderOptions.instance)) {
        return { instance: instances[loaderOptions.instance] };
    }
    try {
        var compiler = require(loaderOptions.compiler);
    }
    catch (e) {
        var message = loaderOptions.compiler == 'typescript'
            ? 'Could not load TypeScript. Try installing with `npm install typescript`. If TypeScript is installed globally, try using `npm link typescript`.'
            : "Could not load TypeScript compiler with NPM package name `" + loaderOptions.compiler + "`. Are you sure it is correctly installed?";
        return {
            error: {
                message: message.red,
                rawMessage: message,
                loaderSource: 'ts-loader'
            }
        };
    }
    var motd = "ts-loader: Using " + loaderOptions.compiler + "@" + compiler.version, compilerCompatible = false;
    if (loaderOptions.compiler == 'typescript') {
        if (compiler.version && semver.gte(compiler.version, '1.6.2-0')) {
            compilerCompatible = true;
        }
        else {
            log((motd + ". This version is incompatible with ts-loader. Please upgrade to the latest version of TypeScript.").red);
        }
    }
    else {
        log((motd + ". This version may or may not be compatible with ts-loader.").yellow);
    }
    var files = {};
    var instance = instances[loaderOptions.instance] = {
        compiler: compiler,
        compilerOptions: null,
        loaderOptions: loaderOptions,
        files: files,
        languageService: null,
        version: 0
    };
    var compilerOptions = {};
    var filesToLoad = [];
    var configFilePath = findConfigFile(compiler, path.dirname(loader.resourcePath), loaderOptions.configFileName);
    var configFile;
    if (configFilePath) {
        if (compilerCompatible)
            log((motd + " and " + configFilePath).green);
        else
            log(("ts-loader: Using config file at " + configFilePath).green);
        configFile = compiler.readConfigFile(configFilePath, compiler.sys.readFile);
        if (configFile.error) {
            var configFileError = formatErrors([configFile.error], instance, { file: configFilePath })[0];
            return { error: configFileError };
        }
    }
    else {
        if (compilerCompatible)
            log(motd.green);
        configFile = {
            config: {
                compilerOptions: {},
                files: []
            }
        };
    }
    configFile.config.compilerOptions = objectAssign({}, configFile.config.compilerOptions, loaderOptions.compilerOptions);
    if (loaderOptions.transpileOnly) {
        configFile.config.compilerOptions.isolatedModules = true;
    }
    var configParseResult;
    if (typeof compiler.parseJsonConfigFileContent === 'function') {
        configParseResult = compiler.parseJsonConfigFileContent(configFile.config, compiler.sys, path.dirname(configFilePath));
    }
    else {
        configParseResult = compiler.parseConfigFile(configFile.config, compiler.sys, path.dirname(configFilePath));
    }
    if (configParseResult.errors.length) {
        pushArray(loader._module.errors, formatErrors(configParseResult.errors, instance, { file: configFilePath }));
        return {
            error: {
                file: configFilePath,
                message: 'error while parsing tsconfig.json'.red,
                rawMessage: 'error while parsing tsconfig.json',
                loaderSource: 'ts-loader'
            }
        };
    }
    instance.compilerOptions = objectAssign(compilerOptions, configParseResult.options);
    filesToLoad = configParseResult.fileNames;
    if (compilerOptions.module == null && compilerOptions.target !== 2) {
        compilerOptions.module = 1;
    }
    else if (compilerCompatible && semver.lt(compiler.version, '1.7.3-0') && compilerOptions.target == 2) {
        compilerOptions.module = 0;
    }
    if (loaderOptions.transpileOnly) {
        var program = compiler.createProgram([], compilerOptions), diagnostics = program.getOptionsDiagnostics();
        pushArray(loader._module.errors, formatErrors(diagnostics, instance, { file: configFilePath || 'tsconfig.json' }));
        return { instance: instances[loaderOptions.instance] = { compiler: compiler, compilerOptions: compilerOptions, loaderOptions: loaderOptions, files: files } };
    }
    filesToLoad.forEach(function (filePath) {
        filePath = path.normalize(filePath);
        files[filePath] = {
            text: fs.readFileSync(filePath, 'utf-8'),
            version: 0
        };
    });
    var newLine = compilerOptions.newLine === 0 ? '\r\n' :
        compilerOptions.newLine === 1 ? '\n' :
            os.EOL;
    var resolver = makeResolver(loader.options);
    var readFile = function (fileName) {
        fileName = path.normalize(fileName);
        try {
            return fs.readFileSync(fileName, { encoding: 'utf8' });
        }
        catch (e) {
            return;
        }
    };
    var moduleResolutionHost = {
        fileExists: function (fileName) { return readFile(fileName) !== undefined; },
        readFile: function (fileName) { return readFile(fileName); }
    };
    var servicesHost = {
        getProjectVersion: function () { return instance.version + ''; },
        getScriptFileNames: function () { return Object.keys(files).filter(function (filePath) { return scriptRegex.test(filePath); }); },
        getScriptVersion: function (fileName) {
            fileName = path.normalize(fileName);
            return files[fileName] && files[fileName].version.toString();
        },
        getScriptSnapshot: function (fileName) {
            fileName = path.normalize(fileName);
            var file = files[fileName];
            if (!file) {
                var text = readFile(fileName);
                if (text == null)
                    return;
                file = files[fileName] = { version: 0, text: text };
            }
            return compiler.ScriptSnapshot.fromString(file.text);
        },
        getCurrentDirectory: function () { return process.cwd(); },
        getCompilationSettings: function () { return compilerOptions; },
        getDefaultLibFileName: function (options) { return compiler.getDefaultLibFilePath(options); },
        getNewLine: function () { return newLine; },
        log: log,
        resolveModuleNames: function (moduleNames, containingFile) {
            var resolvedModules = [];
            for (var _i = 0, moduleNames_1 = moduleNames; _i < moduleNames_1.length; _i++) {
                var moduleName = moduleNames_1[_i];
                var resolvedFileName = void 0;
                var resolutionResult = void 0;
                try {
                    resolvedFileName = resolver.resolveSync(path.normalize(path.dirname(containingFile)), moduleName);
                    if (!resolvedFileName.match(/\.tsx?$/))
                        resolvedFileName = null;
                    else
                        resolutionResult = { resolvedFileName: resolvedFileName };
                }
                catch (e) {
                    resolvedFileName = null;
                }
                var tsResolution = compiler.resolveModuleName(moduleName, containingFile, compilerOptions, moduleResolutionHost);
                if (tsResolution.resolvedModule) {
                    if (resolvedFileName) {
                        if (resolvedFileName == tsResolution.resolvedModule.resolvedFileName) {
                            resolutionResult.isExternalLibraryImport = tsResolution.resolvedModule.isExternalLibraryImport;
                        }
                    }
                    else
                        resolutionResult = tsResolution.resolvedModule;
                }
                resolvedModules.push(resolutionResult);
            }
            return resolvedModules;
        }
    };
    var languageService = instance.languageService = compiler.createLanguageService(servicesHost, compiler.createDocumentRegistry());
    var getCompilerOptionDiagnostics = true;
    loader._compiler.plugin("after-compile", function (compilation, callback) {
        var stats = compilation.stats;
        function removeTSLoaderErrors(errors) {
            var index = -1, length = errors.length;
            while (++index < length) {
                if (errors[index].loaderSource == 'ts-loader') {
                    errors.splice(index--, 1);
                    length--;
                }
            }
        }
        removeTSLoaderErrors(compilation.errors);
        if (getCompilerOptionDiagnostics) {
            getCompilerOptionDiagnostics = false;
            pushArray(compilation.errors, formatErrors(languageService.getCompilerOptionsDiagnostics(), instance, { file: configFilePath || 'tsconfig.json' }));
        }
        var modules = {};
        compilation.modules.forEach(function (module) {
            if (module.resource) {
                var modulePath = path.normalize(module.resource);
                if (hasOwnProperty(modules, modulePath)) {
                    var existingModules = modules[modulePath];
                    if (existingModules.indexOf(module) == -1) {
                        existingModules.push(module);
                    }
                }
                else {
                    modules[modulePath] = [module];
                }
            }
        });
        Object.keys(instance.files)
            .filter(function (filePath) { return !!filePath.match(/(\.d)?\.ts(x?)$/); })
            .forEach(function (filePath) {
                var errors = languageService.getSyntacticDiagnostics(filePath).concat(languageService.getSemanticDiagnostics(filePath));
                if (hasOwnProperty(modules, filePath)) {
                    var associatedModules = modules[filePath];
                    associatedModules.forEach(function (module) {
                        removeTSLoaderErrors(module.errors);
                        var formattedErrors = formatErrors(errors, instance, { module: module });
                        pushArray(module.errors, formattedErrors);
                        pushArray(compilation.errors, formattedErrors);
                    });
                }
                else {
                    pushArray(compilation.errors, formatErrors(errors, instance, { file: filePath }));
                }
            });
        callback();
    });
    loader._compiler.plugin("watch-run", function (watching, cb) {
        var mtimes = watching.compiler.watchFileSystem.watcher.mtimes;
        Object.keys(mtimes)
            .filter(function (filePath) { return !!filePath.match(/\.d\.ts$/); })
            .forEach(function (filePath) {
                filePath = path.normalize(filePath);
                var file = instance.files[filePath];
                if (file) {
                    file.text = fs.readFileSync(filePath, { encoding: 'utf8' });
                    file.version++;
                    instance.version++;
                }
            });
        cb();
    });
    return { instance: instance };
}
function loader(contents) {
    this.cacheable && this.cacheable();
    var callback = this.async();
    var filePath = path.normalize(this.resourcePath);
    var queryOptions = loaderUtils.parseQuery(this.query);
    var configFileOptions = this.options.ts || {};
    var options = objectAssign({}, {
        silent: false,
        instance: 'default',
        compiler: 'typescript',
        configFileName: 'tsconfig.json',
        transpileOnly: false,
        compilerOptions: {}
    }, configFileOptions, queryOptions);
    options.ignoreDiagnostics = arrify(options.ignoreDiagnostics).map(Number);
    var webpackIndex = webpackInstances.indexOf(this._compiler);
    if (webpackIndex == -1) {
        webpackIndex = webpackInstances.push(this._compiler) - 1;
    }
    options.instance = webpackIndex + '_' + options.instance;
    var _a = ensureTypeScriptInstance(options, this), instance = _a.instance, error = _a.error;
    if (error) {
        callback(error);
        return;
    }
    var file = instance.files[filePath];
    if (!file) {
        file = instance.files[filePath] = { version: 0 };
    }
    if (file.text !== contents) {
        file.version++;
        file.text = contents;
        instance.version++;
    }
    var outputText, sourceMapText, diagnostics = [];
    if (options.transpileOnly) {
        var fileName = path.basename(filePath);
        var transpileResult = instance.compiler.transpileModule(contents, {
            compilerOptions: instance.compilerOptions,
            reportDiagnostics: true,
            fileName: fileName
        });
        (outputText = transpileResult.outputText, sourceMapText = transpileResult.sourceMapText, diagnostics = transpileResult.diagnostics, transpileResult);
        pushArray(this._module.errors, formatErrors(diagnostics, instance, { module: this._module }));
    }
    else {
        var langService = instance.languageService;
        this.clearDependencies();
        this.addDependency(filePath);
        var allDefinitionFiles = Object.keys(instance.files).filter(function (filePath) { return /\.d\.ts$/.test(filePath); });
        allDefinitionFiles.forEach(this.addDependency.bind(this));
        this._module.meta.tsLoaderDefinitionFileVersions = allDefinitionFiles.map(function (filePath) { return filePath + '@' + instance.files[filePath].version; });
        var output = langService.getEmitOutput(filePath);
        var outputFile = output.outputFiles.filter(function (file) { return !!file.name.match(/\.js(x?)$/); }).pop();
        if (outputFile) {
            outputText = outputFile.text;
        }
        var sourceMapFile = output.outputFiles.filter(function (file) { return !!file.name.match(/\.js(x?)\.map$/); }).pop();
        if (sourceMapFile) {
            sourceMapText = sourceMapFile.text;
        }
        var declarationFile = output.outputFiles.filter(function (file) { return !!file.name.match(/\.d.ts$/); }).pop();
        if (declarationFile) {
            this.emitFile(path.relative(this.options.context, declarationFile.name), declarationFile.text);
        }
        diagnostics = diagnostics
            .concat(langService.getSyntacticDiagnostics(filePath))
            .concat(langService.getSemanticDiagnostics(filePath))
            .concat(langService.getCompilerOptionsDiagnostics());
    }
    if (outputText == null)
        throw new Error("Typescript emitted no output for " + filePath);
    if (sourceMapText) {
        var sourceMap = JSON.parse(sourceMapText);
        sourceMap.sources = [loaderUtils.getRemainingRequest(this)];
        sourceMap.file = filePath;
        sourceMap.sourcesContent = [contents];
        outputText = outputText.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
    }
    this._module.meta.tsLoaderFileVersion = file.version;
    var errorDiagnostics = diagnostics.filter(function (d) { return d.category == typescript.DiagnosticCategory.Error; }), err = errorDiagnostics.length > 0
        ? errorDiagnostics.map(function (d) { return ("ERROR in " + d.file.fileName + "\n(" + d.start + ", " + d.length + "): error TS" + d.code + ": " + d.messageText); })
        : null;
    if (err && err.length > 0) {
        console.error('ts-loader detected following errors:');
        err.forEach(function (e, i) { return console.error("    " + (i + 1) + ")", e.replace('\n', '\n       '), "\n"); });
    }
    callback(null, outputText, sourceMap);
}
module.exports = loader;
