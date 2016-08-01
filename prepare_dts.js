const fs = require('fs');

const mainModule = 'react-material-ui-keyboard';

const git = `https://github.com/NoHomey`;

const version = '1.0.0'

const dependencies = [
    'react',
    'material-ui'
]

let header = [
    `// Type definitions for ${mainModule} ${version}`,
    `// Project: ${git}/${mainModule}`,
    `// Definitions by: Ivo Stratev <${git}>`,
    '// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped',
    '',
];

dependencies.forEach((dependency) => {
    header.push(`///<reference path='../${dependency}/${dependency}.d.ts' />`);
});

header.push('\n');

const index = header.join('\n') + `declare module '${mainModule}' {\n\texport * from '${mainModule}/Keyboard';\n}\n\n`;

const src = [
    "Keyboard",
    "KeyboardKey",
    "SimpleListItem"
]

const components = src.map((component) => {
    const content = fs.readFileSync(`${__dirname}/dts/${component}.d.ts`).toString();
    const componentModule = content.replace(/declare\ /g, '').replace(/\n/g, '\n\t').replace(/\'\.\//g, `'${mainModule}/`);
    return `declare module '${mainModule}/${component}' {\n\t${componentModule.substring(0, componentModule.length - 1)}}`;
});

fs.writeFileSync(`${__dirname}/dts.d.ts`, index + components.join('\n\n'));