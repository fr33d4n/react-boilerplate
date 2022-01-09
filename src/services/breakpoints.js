export const minSize = {
    extraSmall: 420,
    small: 600,
    medium: 768,
    large: 1024,
    extraLarge: 1366,
    huge: 1440,
};

export const maxSize = {
    extraSmall: minSize.extraSmall - 1,
    small: minSize.small - 1,
    medium: minSize.medium - 1,
    large: minSize.large - 1,
    extraLarge: minSize.extraLarge - 1,
    huge: minSize.huge - 1,
};

export const devices = {
    mediumPhone: `(min-width: ${minSize.extraSmall})`,
    largePhone: `(min-width: ${minSize.small})`,
    tablet: `(min-width: ${minSize.medium})`,
    largeTablet: `(min-width: ${minSize.large})`,
    laptop: `(min-width: ${minSize.extraLarge})`,
    desktop: `(min-width: ${minSize.huge})`,
};

export const mediaDevices = {
    phones: `(max-width: ${maxSize.medium}px)`,
    tablets: `(min-width: ${minSize.medium}px) and (max-width: ${maxSize.extraLarge}px)`,
    laptops: `(min-width: ${minSize.extraLarge}px)`,
};
