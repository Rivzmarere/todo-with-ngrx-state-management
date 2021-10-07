"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripSourceCode = void 0;
const typescript_1 = require("typescript");
function stripSourceCode(scanner, contents) {
    if (contents.indexOf('loadChildren') > -1) {
        return contents;
    }
    if (contents.indexOf('require') > -1) {
        return contents;
    }
    scanner.setText(contents);
    let token = scanner.scan();
    const statements = [];
    let start = null;
    while (token !== typescript_1.SyntaxKind.EndOfFileToken) {
        const potentialStart = scanner.getStartPos();
        switch (token) {
            case typescript_1.SyntaxKind.ImportKeyword: {
                token = scanner.scan();
                while (token === typescript_1.SyntaxKind.WhitespaceTrivia ||
                    token === typescript_1.SyntaxKind.NewLineTrivia) {
                    token = scanner.scan();
                }
                start = potentialStart;
                break;
            }
            case typescript_1.SyntaxKind.ExportKeyword: {
                token = scanner.scan();
                while (token === typescript_1.SyntaxKind.WhitespaceTrivia ||
                    token === typescript_1.SyntaxKind.NewLineTrivia) {
                    token = scanner.scan();
                }
                if (token === typescript_1.SyntaxKind.OpenBraceToken ||
                    token === typescript_1.SyntaxKind.AsteriskToken) {
                    start = potentialStart;
                }
                break;
            }
            case typescript_1.SyntaxKind.StringLiteral: {
                if (start !== null) {
                    token = scanner.scan();
                    if (token === typescript_1.SyntaxKind.CloseParenToken) {
                        token = scanner.scan();
                    }
                    const end = scanner.getStartPos();
                    statements.push(contents.substring(start, end));
                    start = null;
                }
                else {
                    token = scanner.scan();
                }
                break;
            }
            default: {
                token = scanner.scan();
            }
        }
    }
    return statements.join('\n');
}
exports.stripSourceCode = stripSourceCode;
//# sourceMappingURL=strip-source-code.js.map