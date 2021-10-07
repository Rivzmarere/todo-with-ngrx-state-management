"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const child_process_1 = require("child_process");
const path = require("path");
const resolve = require("resolve");
const shared_1 = require("./shared");
const fileutils_1 = require("../utils/fileutils");
const project_graph_1 = require("../core/project-graph");
const affected_project_graph_1 = require("../core/affected-project-graph");
const file_utils_1 = require("../core/file-utils");
const utils_1 = require("./utils");
const PRETTIER_EXTENSIONS = [
    'ts',
    'js',
    'tsx',
    'jsx',
    'scss',
    'less',
    'css',
    'html',
    'json',
    'md',
    'mdx',
];
const MATCH_ALL_PATTERN = `**/*.{${PRETTIER_EXTENSIONS.join(',')}}`;
function format(command, args) {
    const { nxArgs } = utils_1.splitArgsIntoNxArgsAndOverrides(args, 'affected');
    const patterns = getPatterns(Object.assign(Object.assign({}, args), nxArgs)).map((p) => `"${p}"`);
    // Chunkify the patterns array to prevent crashing the windows terminal
    const chunkList = chunkify(patterns, 50);
    switch (command) {
        case 'write':
            chunkList.forEach((chunk) => write(chunk));
            break;
        case 'check':
            chunkList.forEach((chunk) => check(chunk));
            break;
    }
}
exports.format = format;
function getPatterns(args) {
    const allFilesPattern = [MATCH_ALL_PATTERN];
    try {
        if (args.all) {
            return allFilesPattern;
        }
        if (args.projects && args.projects.length > 0) {
            return getPatternsFromProjects(args.projects);
        }
        const p = shared_1.parseFiles(args);
        const patterns = p.files
            .filter((f) => fileutils_1.fileExists(f))
            .filter((f) => PRETTIER_EXTENSIONS.map((ext) => '.' + ext).includes(path.extname(f)));
        return args.libsAndApps ? getPatternsFromApps(patterns) : patterns;
    }
    catch (e) {
        return allFilesPattern;
    }
}
function getPatternsFromApps(affectedFiles) {
    const graph = project_graph_1.onlyWorkspaceProjects(project_graph_1.createProjectGraph());
    const affectedGraph = affected_project_graph_1.filterAffected(graph, file_utils_1.calculateFileChanges(affectedFiles));
    return getPatternsFromProjects(Object.keys(affectedGraph.nodes));
}
function getPatternsFromProjects(projects) {
    const roots = shared_1.getProjectRoots(projects);
    return roots.map((root) => `${root}/${MATCH_ALL_PATTERN}`);
}
function chunkify(target, size) {
    return target.reduce((current, value, index) => {
        if (index % size === 0)
            current.push([]);
        current[current.length - 1].push(value);
        return current;
    }, []);
}
function write(patterns) {
    if (patterns.length > 0) {
        child_process_1.execSync(`node "${prettierPath()}" --write ${patterns.join(' ')}`, {
            stdio: [0, 1, 2],
        });
    }
}
function check(patterns) {
    if (patterns.length > 0) {
        try {
            child_process_1.execSync(`node "${prettierPath()}" --list-different ${patterns.join(' ')}`, {
                stdio: [0, 1, 2],
            });
        }
        catch (e) {
            process.exit(1);
        }
    }
}
function prettierPath() {
    const basePath = path.dirname(resolve.sync('prettier', { basedir: __dirname }));
    return path.join(basePath, 'bin-prettier.js');
}
//# sourceMappingURL=format.js.map