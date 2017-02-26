import fs from 'fs';
import os from 'os';
import path from 'path';

if (!fs.existsSync(path.join(os.homedir(), '.handle'))) {
    fs.mkdirSync(path.join(os.homedir(), '.handle'));
}

if (!fs.existsSync(path.join(os.homedir(), '.handle', 'settings.json'))) {
    fs.closeSync(fs.openSync(path.join(os.homedir(), '.handle', 'settings.json'), 'w'));
}

const json = fs.readFileSync(path.join(os.homedir(), '.handle', 'settings.json'), 'utf8');
let result;

try {
    result = JSON.parse(json);
} catch (e) {
    result = {
        accessToken: '',
        accountId: ''
    };
}

export default result;
