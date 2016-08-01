const fs = require('fs');

const mainModule = 'react-material-ui-keyboard';

const index = `declare module '${mainModule}' {\n\texport * from '${mainModule}/Keyboard';\n}\n\n`;

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