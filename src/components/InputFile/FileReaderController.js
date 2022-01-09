import { FILE_CONTEXT } from './fileConstant';

export default class FileReaderController {
    constructor(_fileItem) {
        this.config();
        this.file = _fileItem;
    }

    config() {
        this.encoding = 'utf-8';
        this.userOnLoaded = () => {};
        this.userOnloadStart = () => {};
        this.userOnProgress = () => {};
        this.userCallback = () => {};
        this.userAbort = () => {};
    }

    error(_errorCallback) {
        this.userError = _errorCallback;
    }

    abort(_abortCallback) {
        this.userAbort = _abortCallback;
    }

    onLoaded(_onLoadedCallback) {
        this.userOnLoaded = _onLoadedCallback;
    }

    onLoadStart(_onLoadStartCallback) {
        this.userOnloadStart = _onLoadStartCallback;
    }

    onProgress(_onProgressCallback) {
        this.userOnProgress = _onProgressCallback;
    }

    successCallback(_successCallback) {
        this.userCallback = _successCallback;
    }

    createFileReaderObject() {
        const reader = new FileReader();
        reader.onerror = this.userError;
        reader.onabort = this.userAbort;
        reader.onloadstart = this.userOnloadStart;
        reader.onprogress = this.userOnProgress;
        reader.onloadend = this.userOnLoaded;
        return reader;
    }

    readAsBinaryString() {
        return new Promise((_resolve, _reject) => {
            try {
                const allFiles = [];
                Object.keys(this.file).forEach((item) => {
                    const reader = this.createFileReaderObject();
                    const promise = new Promise((resolve, reject) => {
                        reader.onloadend = (_result) => {
                            const string = this.resultString != null ? this.resultString : _result.target.result;
                            const result = new Uint8Array(string.length);
                            const strLen = string.length;
                            for (let i = 0; i < strLen; i += 1) {
                                result[i] = string.charCodeAt(i);
                            }
                            resolve(result);
                        };
                        reader.onerror = (error) => {
                            reject(error);
                        };
                    });
                    allFiles.push(promise);
                    reader.readAsBinaryString(this.file[item]);
                });
                _resolve(Promise.all(allFiles));
            } catch (_error) {
                _reject(_error);
            }
        });
    }

    readAsArrayBuffer() {
        return new Promise((_resolve, _reject) => {
            try {
                const allFiles = [];
                Object.keys(this.file).forEach((item) => {
                    const reader = this.createFileReaderObject();
                    const promise = new Promise((resolve, reject) => {
                        reader.onloadend = (_result) => {
                            resolve(_result.target.result);
                        };
                        reader.onerror = (error) => {
                            reject(error);
                        };
                    });
                    allFiles.push(promise);
                    reader.readAsArrayBuffer(this.file[item]);
                });
                _resolve(Promise.all(allFiles));
            } catch (_error) {
                _reject(_error);
            }
        });
    }

    readAsText() {
        return new Promise((_resolve, _reject) => {
            try {
                const allFiles = [];
                Object.keys(this.file).forEach((item) => {
                    const reader = this.createFileReaderObject();
                    const promise = new Promise((resolve, reject) => {
                        reader.onloadend = (_result) => {
                            resolve(_result.target.result);
                        };
                        reader.onerror = (error) => {
                            reject(error);
                        };
                    });
                    allFiles.push(promise);
                    reader.readAsText(this.file[item], this.encoding);
                });
                _resolve(Promise.all(allFiles));
            } catch (_error) {
                _reject(_error);
            }
        });
    }

    readAsDataURL() {
        return new Promise((_resolve, _reject) => {
            try {
                const allFiles = [];
                Object.keys(this.file).forEach((item) => {
                    const reader = this.createFileReaderObject();
                    const promise = new Promise((resolve, reject) => {
                        reader.onloadend = (_result) => {
                            resolve(_result.target.result);
                        };
                        reader.onerror = (error) => {
                            reject(error);
                        };
                    });
                    allFiles.push(promise);
                    reader.readAsDataURL(this.file[item]);
                });
                Promise.all(allFiles).then((f) => _resolve(f));
            } catch (_error) {
                _reject(_error);
            }
        });
    }

    fileUpload(_type = FILE_CONTEXT.SENDING_TYPE.READ_AS_BINARY_STRING) {
        let sendFile = null;
        // eslint-disable-next-line default-case
        switch (_type) {
            case FILE_CONTEXT.SENDING_TYPE.READ_AS_BINARY_STRING:
                sendFile = this.readAsBinaryString();
                break;
            case FILE_CONTEXT.SENDING_TYPE.READ_AS_ARRAY_BUFFER:
                sendFile = this.readAsArrayBuffer();
                break;
            case FILE_CONTEXT.SENDING_TYPE.READ_AS_TEXT:
                sendFile = this.readAsText();
                break;
            case FILE_CONTEXT.SENDING_TYPE.READ_AS_DATA_URL:
                sendFile = this.readAsDataURL();
                break;
        }
        return sendFile;
    }
}
