import fs from 'fs';
import os from 'os';
import path from 'path';
import inquirer from 'inquirer';
import registry from './registry';

export default async () => {
    try {
        const questions = [
            {
                name: 'email',
                type: 'input',
                message: 'Enter your Handle e-mail address:',
                validate: function( value ) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your e-mail address';
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password';
                    }
                }
            }
        ];

        const credentials = await inquirer.prompt(questions);
        const settings = await registry.login(credentials);

        fs.writeFileSync(path.join(os.homedir(), '.handle', 'settings.json'), JSON.stringify(settings, null, 2));
    } catch (e) {
        console.log('Failed to log in');
    }


}
