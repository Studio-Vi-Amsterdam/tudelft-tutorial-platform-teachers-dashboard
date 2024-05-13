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
    return (
        <header className="z-50  bg-white py-5">
            <div className="container mx-auto flex flex-row items-center justify-between">
                {pathname && (
                    <h1 className="flex text-2xl font-bold leading-[30px] -tracking-6 ">
                        <p
                            onClick={() => navigate('/')}
                            className="cursor-pointer"
                        >
                            DigiPedia{' '}
                        </p>
                        <span className="ml-1 font-normal text-primary-skyBlue">
                            Dashboard
                        </span>
                    </h1>
                )}

                {pathname && (
                    <nav className="flex flex-row items-center">
                        <ul className="flex flex-row [&>li>button]:relative [&>li>button]:text-base [&>li>button]:transition-all [&>li>button]:duration-300 [&>li>button]:before:absolute [&>li>button]:before:-bottom-[6px] [&>li>button]:before:h-[2px] [&>li>button]:before:w-full [&>li>button]:before:transition-all [&>li>button]:before:duration-300 [&>li]:cursor-pointer [&>li]:px-8">
                            <li>
                                <button
                                    onClick={() => navigate('dashboard')}
                                    className={`${
                                        pathname
                                            .split('/')
                                            .find((item) => item === 'media')
                                            ? 'text-tertiary-grey-dim before:bg-transparent'
                                            : 'text-primary before:bg-black'
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
                        <div className="ml-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary-navy text-white">
                            ML
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
