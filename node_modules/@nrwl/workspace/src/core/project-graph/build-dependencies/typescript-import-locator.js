"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptImportLocator = void 0;
const ts = require("typescript");
const path = require("path");
const project_graph_models_1 = require("../project-graph-models");
const strip_source_code_1 = require("../../../utils/strip-source-code");
class TypeScriptImportLocator {
    constructor(fileRead) {
        this.fileRead = fileRead;
        this.scanner = ts.createScanner(ts.ScriptTarget.Latest, false);
    }
    fromFile(filePath, visitor) {
        const extension = path.extname(filePath);
        if (extension !== '.ts' &&
            extension !== '.tsx' &&
            extension !== '.js' &&
            extension !== '.jsx') {
            return;
        }
        const content = this.fileRead(filePath);
        const strippedContent = strip_source_code_1.stripSourceCode(this.scanner, content);
        if (strippedContent !== '') {
            const tsFile = ts.createSourceFile(filePath, strippedContent, ts.ScriptTarget.Latest, true);
            this.fromNode(filePath, tsFile, visitor);
        }
    }
    fromNode(filePath, node, visitor) {
        if (ts.isImportDeclaration(node) ||
            (ts.isExportDeclaration(node) && node.moduleSpecifier)) {
            const imp = this.getStringLiteralValue(node.moduleSpecifier);
            visitor(imp, filePath, project_graph_models_1.DependencyType.static);
            return; // stop traversing downwards
        }
        if (ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword &&
            node.arguments.length === 1 &&
            ts.isStringLiteral(node.arguments[0])) {
            const imp = this.getStringLiteralValue(node.arguments[0]);
            visitor(imp, filePath, project_graph_models_1.DependencyType.dynamic);
            return;
        }
        if (ts.isCallExpression(node) &&
            node.expression.getText() === 'require' &&
            node.arguments.length === 1 &&
            ts.isStringLiteral(node.arguments[0])) {
            const imp = this.getStringLiteralValue(node.arguments[0]);
            visitor(imp, filePath, project_graph_models_1.DependencyType.static);
            return;
        }
        if (node.kind === ts.SyntaxKind.PropertyAssignment) {
            const name = this.getPropertyAssignmentName(node.name);
            if (name === 'loadChildren') {
                const init = node.initializer;
                if (init.kind === ts.SyntaxKind.StringLiteral) {
                    const childrenExpr = this.getStringLiteralValue(init);
                    visitor(childrenExpr, filePath, project_graph_models_1.DependencyType.dynamic);
                    return; // stop traversing downwards
                }
            }
        }
        /**
         * Continue traversing down the AST from the current node
         */
        ts.forEachChild(node, (child) => this.fromNode(filePath, child, visitor));
    }
    getPropertyAssignmentName(nameNode) {
        switch (nameNode.kind) {
            case ts.SyntaxKind.Identifier:
                return nameNode.getText();
            case ts.SyntaxKind.StringLiteral:
                return nameNode.text;
            default:
                return null;
        }
    }
    getStringLiteralValue(node) {
        return node.getText().substr(1, node.getText().length - 2);
    }
}
exports.TypeScriptImportLocator = TypeScriptImportLocator;
//# sourceMappingURL=typescript-import-locator.js.map