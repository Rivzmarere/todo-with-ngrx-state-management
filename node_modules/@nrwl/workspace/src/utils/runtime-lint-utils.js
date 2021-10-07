"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasArchitectBuildBuilder = exports.getSourceFilePath = exports.onlyLoadChildren = exports.findConstraintsFor = exports.checkCircularPath = exports.findProjectUsingImport = exports.isAbsoluteImportIntoAnotherProject = exports.findTargetProject = exports.findSourceProject = exports.findProjectUsingFile = exports.isRelativeImportIntoAnotherProject = exports.isRelative = exports.matchImportWithWildcard = exports.hasNoneOfTheseTags = void 0;
const core_1 = require("@angular-devkit/core");
const path = require("path");
const project_graph_1 = require("../core/project-graph");
function hasNoneOfTheseTags(proj, tags) {
    return tags.filter((allowedTag) => hasTag(proj, allowedTag)).length === 0;
}
exports.hasNoneOfTheseTags = hasNoneOfTheseTags;
function hasTag(proj, tag) {
    return (proj.data.tags || []).indexOf(tag) > -1 || tag === '*';
}
function containsFile(files, targetFileWithoutExtension) {
    return !!files.filter((f) => removeExt(f.file) === targetFileWithoutExtension)[0];
}
function removeExt(file) {
    return file.replace(/\.[^/.]+$/, '');
}
function removeWindowsDriveLetter(osSpecificPath) {
    return osSpecificPath.replace(/^[A-Z]:/, '');
}
function normalizePath(osSpecificPath) {
    return removeWindowsDriveLetter(osSpecificPath).split(path.sep).join('/');
}
function matchImportWithWildcard(
// This may or may not contain wildcards ("*")
allowableImport, extractedImport) {
    if (allowableImport.endsWith('/**')) {
        const prefix = allowableImport.substring(0, allowableImport.length - 2);
        return extractedImport.startsWith(prefix);
    }
    else if (allowableImport.endsWith('/*')) {
        const prefix = allowableImport.substring(0, allowableImport.length - 1);
        if (!extractedImport.startsWith(prefix))
            return false;
        return extractedImport.substring(prefix.length).indexOf('/') === -1;
    }
    else if (allowableImport.indexOf('/**/') > -1) {
        const [prefix, suffix] = allowableImport.split('/**/');
        return (extractedImport.startsWith(prefix) && extractedImport.endsWith(suffix));
    }
    else {
        return new RegExp(allowableImport).test(extractedImport);
    }
}
exports.matchImportWithWildcard = matchImportWithWildcard;
function isRelative(s) {
    return s.startsWith('.');
}
exports.isRelative = isRelative;
function isRelativeImportIntoAnotherProject(imp, projectPath, projectGraph, sourceFilePath) {
    if (!isRelative(imp))
        return false;
    const targetFile = normalizePath(path.resolve(path.join(projectPath, path.dirname(sourceFilePath)), imp)).substring(projectPath.length + 1);
    const sourceProject = findSourceProject(projectGraph, sourceFilePath);
    const targetProject = findTargetProject(projectGraph, targetFile);
    return sourceProject && targetProject && sourceProject !== targetProject;
}
exports.isRelativeImportIntoAnotherProject = isRelativeImportIntoAnotherProject;
function findProjectUsingFile(projectGraph, file) {
    return Object.values(projectGraph.nodes).filter((n) => containsFile(n.data.files, file))[0];
}
exports.findProjectUsingFile = findProjectUsingFile;
function findSourceProject(projectGraph, sourceFilePath) {
    const targetFile = removeExt(sourceFilePath);
    return findProjectUsingFile(projectGraph, targetFile);
}
exports.findSourceProject = findSourceProject;
function findTargetProject(projectGraph, targetFile) {
    let targetProject = findProjectUsingFile(projectGraph, targetFile);
    if (!targetProject) {
        targetProject = findProjectUsingFile(projectGraph, normalizePath(path.join(targetFile, 'index')));
    }
    if (!targetProject) {
        targetProject = findProjectUsingFile(projectGraph, normalizePath(path.join(targetFile, 'src', 'index')));
    }
    return targetProject;
}
exports.findTargetProject = findTargetProject;
function isAbsoluteImportIntoAnotherProject(imp) {
    // TODO: vsavkin: check if this needs to be fixed once we generalize lint rules
    return (imp.startsWith('libs/') ||
        imp.startsWith('/libs/') ||
        imp.startsWith('apps/') ||
        imp.startsWith('/apps/'));
}
exports.isAbsoluteImportIntoAnotherProject = isAbsoluteImportIntoAnotherProject;
function findProjectUsingImport(projectGraph, targetProjectLocator, filePath, imp, npmScope) {
    const target = targetProjectLocator.findProjectWithImport(imp, filePath, npmScope);
    return projectGraph.nodes[target];
}
exports.findProjectUsingImport = findProjectUsingImport;
function checkCircularPath(graph, sourceProject, targetProject) {
    if (!graph.nodes[targetProject.name])
        return [];
    return getPath(graph, targetProject.name, sourceProject.name);
}
exports.checkCircularPath = checkCircularPath;
const reach = {
    graph: null,
    matrix: null,
    adjList: null,
};
function buildMatrix(graph) {
    const dependencies = graph.dependencies;
    const nodes = Object.keys(graph.nodes).filter((s) => project_graph_1.isWorkspaceProject(graph.nodes[s]));
    const adjList = {};
    const matrix = {};
    const initMatrixValues = nodes.reduce((acc, value) => {
        return Object.assign(Object.assign({}, acc), { [value]: false });
    }, {});
    nodes.forEach((v, i) => {
        adjList[nodes[i]] = [];
        matrix[nodes[i]] = Object.assign({}, initMatrixValues);
    });
    for (let proj in dependencies) {
        for (let dep of dependencies[proj]) {
            if (project_graph_1.isWorkspaceProject(graph.nodes[dep.target])) {
                adjList[proj].push(dep.target);
            }
        }
    }
    const traverse = (s, v) => {
        matrix[s][v] = true;
        for (let adj of adjList[v]) {
            if (matrix[s][adj] === false) {
                traverse(s, adj);
            }
        }
    };
    nodes.forEach((v, i) => {
        traverse(nodes[i], nodes[i]);
    });
    return {
        matrix,
        adjList,
    };
}
function getPath(graph, sourceProjectName, targetProjectName) {
    if (sourceProjectName === targetProjectName)
        return [];
    if (reach.graph !== graph) {
        const result = buildMatrix(graph);
        reach.graph = graph;
        reach.matrix = result.matrix;
        reach.adjList = result.adjList;
    }
    const adjList = reach.adjList;
    let path = [];
    const queue = [[sourceProjectName, path]];
    const visited = [sourceProjectName];
    while (queue.length > 0) {
        const [current, p] = queue.pop();
        path = [...p, current];
        if (current === targetProjectName)
            break;
        adjList[current]
            .filter((adj) => visited.indexOf(adj) === -1)
            .filter((adj) => reach.matrix[adj][targetProjectName])
            .forEach((adj) => {
            visited.push(adj);
            queue.push([adj, [...path]]);
        });
    }
    if (path.length > 1) {
        return path.map((n) => graph.nodes[n]);
    }
    else {
        return [];
    }
}
function findConstraintsFor(depConstraints, sourceProject) {
    return depConstraints.filter((f) => hasTag(sourceProject, f.sourceTag));
}
exports.findConstraintsFor = findConstraintsFor;
function onlyLoadChildren(graph, sourceProjectName, targetProjectName, visited) {
    if (visited.indexOf(sourceProjectName) > -1)
        return false;
    return ((graph.dependencies[sourceProjectName] || []).filter((d) => {
        if (d.type !== project_graph_1.DependencyType.dynamic)
            return false;
        if (d.target === targetProjectName)
            return true;
        return onlyLoadChildren(graph, d.target, targetProjectName, [
            ...visited,
            sourceProjectName,
        ]);
    }).length > 0);
}
exports.onlyLoadChildren = onlyLoadChildren;
function getSourceFilePath(sourceFileName, projectPath) {
    return core_1.normalize(sourceFileName).substring(projectPath.length + 1);
}
exports.getSourceFilePath = getSourceFilePath;
/**
 * Verifies whether the given node has an architect builder attached
 * @param projectGraph the node to verify
 */
function hasArchitectBuildBuilder(projectGraph) {
    return (
    // can the architect not be defined? real use case?
    projectGraph.data.architect &&
        projectGraph.data.architect.build &&
        projectGraph.data.architect.build.builder !== '');
}
exports.hasArchitectBuildBuilder = hasArchitectBuildBuilder;
//# sourceMappingURL=runtime-lint-utils.js.map