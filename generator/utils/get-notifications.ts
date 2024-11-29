import fs from 'fs';
import path from 'path';

interface HomepageNotification {
  title: string;
  details: string;
}

const getNotifications = (docsDir: string): HomepageNotification[] => {
  const file = path.join(docsDir, 'notifications.json');

  if (!fs.existsSync(file)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

export default getNotifications;
