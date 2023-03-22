import fs from 'fs';
import path from 'path';

const gitIgnore = (): string[] => {
  try {
    const raw = fs.readFileSync(path.resolve('.gitignore')).toString();
    return raw.split('\n').map(x => x.toLowerCase());
  } catch (err) {
    return [];
  }
};

export default gitIgnore;
