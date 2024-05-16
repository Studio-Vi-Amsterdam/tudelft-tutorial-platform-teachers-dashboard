export const localFormatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};
