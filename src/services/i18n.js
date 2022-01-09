import { useState, useEffect } from 'react';
import { getHttpClient } from '@bdt/core';

const COOKIE_LANGUAGE_ATTR = 'language';
const ASSETS_BASE_PATH = '/assets/i18n';

function getLanguageFromCookie() {
    const cookies = document.cookie.split(';');
    let pair;
    let i = 1;
    for (; i < cookies.length; i += 1) {
        pair = cookies[i].trim().split('=');
        if (pair[0] === COOKIE_LANGUAGE_ATTR) return pair[1];
    }
    return null;
}

export async function loadAsset(folder) {
    const language = getLanguageFromCookie() || 'es';
    const assetUrl = `${window.bankiaConfig.default.assetsPath}${ASSETS_BASE_PATH}/${folder}/${language}.json`;
    return getHttpClient().get(assetUrl);
}

export function useTranslate(section) {
    const [loadedTranslations, setLoadedTranslations] = useState({});

    useEffect(() => {
        (async () => {
            if (loadedTranslations[section]) {
                return;
            }

            const { response } = await loadAsset(section);
            setLoadedTranslations((current) => ({ ...current, [section]: response }));
        })();
    }, [section]);

    function translate(literal) {
        if (!loadedTranslations[section]) {
            return '';
        }

        return loadedTranslations[section][literal] || '';
    }

    return [translate];
}

export function canShowDebugHelper() {
    if (window.location.host.indexOf('epi1') !== -1) {
        return false;
    }

    return true;
}
