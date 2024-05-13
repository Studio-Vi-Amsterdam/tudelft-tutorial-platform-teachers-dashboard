export const localFormatDate = (date: Date): string => {
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    return formattedDate;
};
