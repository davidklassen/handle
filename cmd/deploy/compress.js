import NodeZip from 'node-zip';

// FIXME: use jszip instead of a wrapper lib
const zip = new NodeZip();


export default (files) => {
    for (const file of Object.keys(files)) {
        zip.file(file, files[file], { binary: true });
    }

    return Buffer.from(zip.generate({ base64: false, compression: 'DEFLATE' }), 'binary');
};
