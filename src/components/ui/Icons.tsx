interface IconsProps {
    color: string;
    bgColor?: string;
    width?: string;
    height?: string;
}

export const CrossIcon = (props: IconsProps) => {
    return (
        <svg
            width={props.width ? props.width : '14'}
            height={props.height ? props.height : '14'}
            viewBox={
                props.width && props.height
                    ? `0 0 ${props.width} ${props.height}`
                    : '0 0 14 14'
            }
            fill={props.bgColor ? props.bgColor : 'none'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 1.23438L13 13.2344M1 13.2344L13 1.23438"
                stroke={props.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export const GalleryBlockViewIcon = (props: IconsProps) => {
    return (
        <svg
            width={props.width ? props.width : '24'}
            height={props.height ? props.height : '24'}
            viewBox={
                props.width && props.height
                    ? `0 0 ${props.width} ${props.height}`
                    : '0 0 24 24'
            }
            fill={props.bgColor ? props.bgColor : 'none'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x={
                    props.width
                        ? (parseFloat(props.width) / 5.3333).toString()
                        : '4.5'
                }
                y={
                    props.height
                        ? (parseFloat(props.height) / 5.3333).toString()
                        : '4.5'
                }
                width={
                    props.width ? (parseInt(props.width) / 4).toString() : '6'
                }
                height={
                    props.height ? (parseInt(props.height) / 4).toString() : '6'
                }
                fill={props.color ? props.color : '#00A6D6'}
                stroke={props.color ? props.color : '#00A6D6'}
            />
            <rect
                x={
                    props.width
                        ? (parseFloat(props.width) / 5.3333).toString()
                        : '4.5'
                }
                y={
                    props.height
                        ? (parseFloat(props.height) / 1.7777).toString()
                        : '13.5'
                }
                width={
                    props.width ? (parseInt(props.width) / 4).toString() : '6'
                }
                height={
                    props.height ? (parseInt(props.height) / 4).toString() : '6'
                }
                fill={props.color ? props.color : '#00A6D6'}
                stroke={props.color ? props.color : '#00A6D6'}
            />
            <rect
                x={
                    props.width
                        ? (parseFloat(props.width) / 1.7777).toString()
                        : '13.5'
                }
                y={
                    props.height
                        ? (parseFloat(props.height) / 5.3333).toString()
                        : '4.5'
                }
                width={
                    props.width ? (parseInt(props.width) / 4).toString() : '6'
                }
                height={
                    props.height ? (parseInt(props.height) / 4).toString() : '6'
                }
                fill={props.color ? props.color : '#00A6D6'}
                stroke={props.color ? props.color : '#00A6D6'}
            />
            <rect
                x={
                    props.width
                        ? (parseFloat(props.width) / 1.7777).toString()
                        : '13.5'
                }
                y={
                    props.height
                        ? (parseFloat(props.height) / 1.7777).toString()
                        : '13.5'
                }
                width={
                    props.width ? (parseInt(props.width) / 4).toString() : '6'
                }
                height={
                    props.height ? (parseInt(props.height) / 4).toString() : '6'
                }
                fill={props.color ? props.color : '#00A6D6'}
                stroke={props.color ? props.color : '#00A6D6'}
            />
        </svg>
    );
};

export const GalleryListViewIcon = (props: IconsProps) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={props.bgColor ? props.bgColor : 'none'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="10" y="5" width="10" height="2" fill={props.color} />
            <rect x="10" y="11" width="10" height="2" fill={props.color} />
            <rect x="10" y="17" width="10" height="2" fill={props.color} />
            <rect x="4" y="4" width="4" height="4" fill={props.color} />
            <rect x="4" y="10" width="4" height="4" fill={props.color} />
            <rect x="4" y="16" width="4" height="4" fill={props.color} />
        </svg>
    );
};

export const SearchIcon = (props: IconsProps) => {
    return (
        <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill={props.bgColor ? props.bgColor : 'none'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M19.6408 9.83219C19.6408 14.8227 15.4378 18.9144 10.1954 18.9144C4.95297 18.9144 0.75 14.8227 0.75 9.83219C0.75 4.84164 4.95297 0.75 10.1954 0.75C15.4378 0.75 19.6408 4.84164 19.6408 9.83219Z"
                stroke={props.color}
                strokeWidth="1.5"
            />
            <path
                d="M23.1236 23.1365C23.4217 23.424 23.9051 23.424 24.2033 23.1365C24.5014 22.849 24.5014 22.3828 24.2033 22.0953L23.1236 23.1365ZM16.8547 17.0909L23.1236 23.1365L24.2033 22.0953L17.9344 16.0497L16.8547 17.0909Z"
                fill={props.color}
            />
        </svg>
    );
};

export const SortIcon = (props: IconsProps) => {
    return (
        <svg
            width={props.width ? props.width : '24'}
            height={props.height ? props.height : '24'}
            viewBox={
                props.width && props.height
                    ? `0 0 ${props.width} ${props.height}`
                    : '0 0 24 24'
            }
            fill={props.bgColor ? props.bgColor : 'none'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.91207 18.1515C2.10733 17.9495 2.42392 17.9495 2.61918 18.1515L7.06563 22.7513L11.5121 18.1515C11.7073 17.9495 12.0239 17.9495 12.2192 18.1515C12.4144 18.3535 12.4144 18.681 12.2192 18.883L7.41918 23.8485C7.32541 23.9455 7.19823 24 7.06563 24C6.93302 24 6.80584 23.9455 6.71207 23.8485L1.91207 18.883C1.71681 18.681 1.71681 18.3535 1.91207 18.1515Z"
                fill={props.color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.56641 10.6471L7.56641 23L6.56641 23L6.56641 10.6471C6.56641 10.2897 6.79026 10 7.06641 10C7.34255 10 7.56641 10.2897 7.56641 10.6471Z"
                fill={props.color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21.6192 5.8485C21.4239 6.0505 21.1073 6.0505 20.9121 5.8485L16.4656 1.24873L12.0192 5.8485C11.8239 6.0505 11.5073 6.0505 11.3121 5.8485C11.1168 5.64651 11.1168 5.31901 11.3121 5.11701L16.1121 0.151496C16.2058 0.0544953 16.333 0 16.4656 0C16.5982 0 16.7254 0.0544953 16.8192 0.151496L21.6192 5.11701C21.8144 5.31901 21.8144 5.64651 21.6192 5.8485Z"
                fill={props.color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.9648 13.3529V1H16.9648V13.3529C16.9648 13.7103 16.741 14 16.4648 14C16.1887 14 15.9648 13.7103 15.9648 13.3529Z"
                fill={props.color}
            />
        </svg>
    );
};

export const FilterIcon = (props: IconsProps) => {
    return (
        <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill={props.bgColor ? props.bgColor : 'none'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1.08 3.56L1.72 5.8C1.83 6.19 2.06 6.54 2.37 6.8L8.25 11.63C8.71 12.01 8.98 12.58 8.98 13.18V18.13C8.98 19.14 10.32 19.51 10.84 18.64L11.75 16.89C11.9 16.6 11.98 16.29 11.98 15.96V13.12C11.98 12.55 12.23 12 12.66 11.62L18.14 6.78C18.43 6.53 18.63 6.2 18.74 5.83L19.39 3.55C19.76 2.27 18.8 1 17.47 1H3C1.67 1.01 0.71 2.28 1.08 3.56Z"
                stroke={props.color}
                strokeWidth="1.5"
            />
        </svg>
    );
};
