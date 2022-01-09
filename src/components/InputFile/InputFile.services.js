import { uploadFileTransmission } from '@services/api';
import { FILE_CONTEXT } from './fileConstant';
import FileReaderController from './FileReaderController';

const MAGNITUDE_SIZE = 1024;
const MAGNITUDES = ['Bytes', 'Kb', 'Mb', 'Gb'];

export function getSizeString(size, magnitudeIndex = 0) {
    const nextMagnitude = size / MAGNITUDE_SIZE;
    if (nextMagnitude < 1) {
        return `${Math.floor(size, 1)} ${MAGNITUDES[magnitudeIndex]}`;
    }

    return getSizeString(nextMagnitude, magnitudeIndex + 1);
}

async function uploadFile(inMemoryFile, filename, fileStore) {
    const { response } = await uploadFileTransmission(inMemoryFile, filename, fileStore);
    const { operationResult, operationMessage } = response;
    if (!operationMessage || operationResult !== '00000000') {
        return { error: true };
    }

    return { fileIdentifier: operationMessage };
}

export async function processFile(file, fileEncoding, fileStore) {
    try {
        if (fileEncoding === FILE_CONTEXT.SENDING_TYPE.NONE) {
            return uploadFile(file, null, fileStore);
        }

        const [inMemoryFile] = await new FileReaderController([file]).fileUpload(fileEncoding);

        if (fileEncoding === FILE_CONTEXT.SENDING_TYPE.READ_AS_DATA_URL) {
            return { file, fileContents: inMemoryFile };
        }

        return uploadFile(inMemoryFile, file.name, fileStore);
    } catch (e) {
        return { error: true };
    }
}
