import JSZip from 'jszip';

export function prepareFileToSend(file, filename) {
    const formData = new FormData();

    if (!filename) {
        formData.append('file', file);
    } else {
        formData.append('file', new File(file, filename));
    }

    return formData;
}

export function prepareDniToSend(file) {
    const formData = new FormData();
    const fileName = `dni${Date.now()}.zip`;
    formData.append('file', file, fileName);
    formData.append('server', 'filenet');
    return formData;
}

export async function zipFiles(fileArray) {
    const zip = new JSZip();
    fileArray.forEach((f) => {
        zip.file(f.name, f.contents, { binary: true });
    });
    return zip.generateAsync({ type: 'Blob' });
}
