import path from 'path';
import fs from 'fs';
import saveTemplate from './save-template';
import { type Directory } from './get-dirs';
import getFiles from './get-files';

interface Details {
  name: string;
  description?: string;
}

const parseDetailsFile = (dir: string): Details | null  => {
  const loc = path.join(dir, 'details.json');

  if (!fs.existsSync(loc)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(loc).toString());
}

const renderPage = async (directory: Directory, distDir: string, templatesDir: string) => {
  const outputDir = path.join(distDir, directory.relativePath);
  
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Creating directory: ${directory.relativePath}`);

  console.log(`Generating Page for: ${directory.name}`);
  const files = getFiles(directory.parent);

  files.forEach(x => {
    fs.copyFileSync(x.path, path.join(outputDir, x.name));
  });

  await saveTemplate(path.join(templatesDir, 'page.ejs'), {
    title: directory.name,
    links: directory.children.map(x => ({
      name: x.name,
      path: x.relativePath
    })),
    details: parseDetailsFile(directory.parent),
    files: files.map(x => ({
      name: x.name,
      path: path.join(directory.relativePath, x.name)
    })),
  }, path.join(outputDir, 'index.html'));
};

export default renderPage;
