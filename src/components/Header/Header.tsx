import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [pathname, setPathname] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (location?.pathname) {
            setPathname(location.pathname);
        }
    }, [location]);
    useEffect(() => {
        pathname &&
            console.log(
                pathname.split('/').find((item) => item === 'dashboard')
            );
    }, [pathname]);
    return (
        <header className="container mx-auto flex flex-row items-center justify-between py-5">
            {pathname &&
            pathname.split('/').find((item) => item === 'dashboard') ? (
                <h1 className="flex text-2xl font-bold leading-[30px] -tracking-6 ">
                    <p onClick={() => navigate('/')} className="cursor-pointer">
                        DigiPedia{' '}
                    </p>
                    <span className="ml-1 font-normal text-primary-skyBlue">
                        Dashboard
                    </span>
                </h1>
            ) : (
                <h1 className="flex text-2xl font-bold leading-[30px] -tracking-6 ">
                    Digi<span className="text-primary-skyBlue">Pedia</span>
                </h1>
            )}

            {pathname &&
                pathname.split('/').find((item) => item === 'dashboard') && (
                    <nav className="flex flex-row items-center">
                        <ul className="flex flex-row [&>li>button]:relative [&>li>button]:text-base [&>li>button]:transition-all [&>li>button]:duration-300 [&>li>button]:before:absolute [&>li>button]:before:-bottom-[6px] [&>li>button]:before:h-[2px] [&>li>button]:before:w-full [&>li>button]:before:transition-all [&>li>button]:before:duration-300 [&>li]:cursor-pointer [&>li]:px-8">
                            <li>
                                <button
                                    onClick={() =>
                                        navigate('dashboard/my-tutorials')
                                    }
                                    className={`${
                                        pathname
                                            .split('/')
                                            .find(
                                                (item) =>
                                                    item === 'my-tutorials'
                                            )
                                            ? 'text-primary before:bg-black'
                                            : 'text-tertiary-grey-dim before:bg-transparent'
                                    }`}
                                >
                                    My Tutorials
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('dashboard/media')}
                                    className={`${
                                        pathname
                                            .split('/')
                                            .find((item) => item === 'media')
                                            ? 'text-primary before:bg-black'
                                            : 'text-tertiary-grey-dim before:bg-transparent'
                                    }`}
                                >
                                    Media
                                </button>
                            </li>
                        </ul>
                        <div className="ml-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white">
                            ML
                        </div>
                    </nav>
                )}
        </header>
    );
};

export default Header;
