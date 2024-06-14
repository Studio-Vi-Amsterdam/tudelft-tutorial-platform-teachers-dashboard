import Cookies from 'js-cookie';

export const setAuthToken = (token: string, expires: number) => {
    Cookies.set('tuDelft-token', token, { expires });
};

export const getAuthToken = (): string | undefined => {
    return Cookies.get('tuDelft-token');
};

export const removeAuthToken = () => {
    Cookies.remove('tuDelft-token');
};
