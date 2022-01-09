/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslate } from '@services/i18n';

import { StyledHiddenInput, StyledLabel, StyledIcon, SpinnerSt, ErrorSt, StyledLabelFake } from './InputFile.styles';
import { FILE_CONTEXT } from './fileConstant';
import { processFile } from './InputFile.services';

function InputFile({ className, id, label, icon, validMimeTypes, multiple, errorMessage, valid, onLoaded, uploadFileType, fileStore }) {
    const [translate] = useTranslate('inputFile');

    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mimeTypes = useMemo(() => validMimeTypes.reduce((cur, prev) => `${prev},${cur}`), [validMimeTypes]);

    const handleInputChange = useCallback(
        (e) => {
            (async () => {
                setIsLoading(true);
                const { files } = e.target;

                const { error, fileIdentifier, file, fileContents } = await processFile(files[0], uploadFileType, fileStore);
                setIsLoading(false);
                if (error) {
                    setHasError(true);
                } else if (file && fileContents) {
                    file.contents = fileContents;
                    onLoaded([file]);
                } else if (fileIdentifier) {
                    onLoaded(files, fileIdentifier);
                }
            })();
        },
        [onLoaded, multiple, uploadFileType],
    );

    return (
        <div className={className}>
            <StyledHiddenInput
                id={id}
                type="file"
                accept={mimeTypes}
                multiple={multiple}
                onChange={handleInputChange}
                disabled={isLoading}
            />
            {hasError && (
                <StyledLabel htmlFor={id}>
                    <StyledIcon color={icon.color} type={icon.type} />
                    <ErrorSt>{translate('error')}</ErrorSt>
                </StyledLabel>
            )}
            {!hasError && !isLoading && (
                <StyledLabel htmlFor={id}>
                    <StyledIcon color={icon.color} type={icon.type} />
                    <span>{label}</span>
                </StyledLabel>
            )}
            {!hasError && isLoading && (
                <StyledLabelFake>
                    <StyledIcon color={icon.color} type={icon.type} />
                    {isLoading && <SpinnerSt fullScreen={false} size="xs" />}
                </StyledLabelFake>
            )}
            {!valid && <span>{errorMessage}</span>}
        </div>
    );
}

export default InputFile;

InputFile.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    icon: PropTypes.shape({
        type: PropTypes.string,
        color: PropTypes.oneOf(['active']),
    }),
    validMimeTypes: PropTypes.arrayOf(PropTypes.string),
    multiple: PropTypes.bool,
    errorMessage: PropTypes.string,
    valid: PropTypes.bool,
    onLoaded: PropTypes.func.isRequired,
    uploadFileType: PropTypes.string,
    className: PropTypes.string,
    fileStore: PropTypes.string,
};
InputFile.defaultProps = {
    id: '',
    icon: {
        type: 'attach',
        color: 'active',
    },
    validMimeTypes: ['*'],
    multiple: false,
    errorMessage: '',
    valid: true,
    uploadFileType: FILE_CONTEXT.SENDING_TYPE.NONE,
    className: '',
    fileStore: 'EWDCZZZP',
};
