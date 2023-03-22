import ts from 'typescript';
import fs from 'fs';
import path from 'path';

const compile = (directory: string, outputDir: string) => {
  const program = ts.createProgram({
    rootNames: fs.readdirSync(directory).map(x => path.join(directory, x)),
    options: {
      outDir: outputDir,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES5,
      noImplicitAny: true,
      noEmitOnError: true,
    }
  });

  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  });
};

export default compile;
