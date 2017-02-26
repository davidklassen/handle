import fs from 'fs';
import os from 'os';
import path from 'path';

const json = fs.readFileSync(path.join(os.homedir(), '.handle', 'settings.json'), 'utf8');

export default JSON.parse(json);
