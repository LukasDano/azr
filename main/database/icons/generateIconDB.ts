import * as fs from 'fs';
import * as path from 'path';

function generateIconListJSON(iconFolder: string): void {
    const outputPath: string = path.join(__dirname, 'icons.json');

    fs.readdir(iconFolder, (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Sort files alphabetically
        files.sort();

        const iconList: { [key: string]: string } = files.reduce((acc: { [key: string]: string }, file: string) => {
            const [name, format] = file.split('.');
            acc[name] = format;
            return acc;
        }, {});

        fs.writeFile(outputPath, JSON.stringify(iconList, null, 2), (err: NodeJS.ErrnoException | null) => {
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log('Icon list JSON file has been generated');
            }
        });
    });
}

const iconFolder = "../../pictures/icons";
generateIconListJSON(iconFolder);
