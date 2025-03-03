import React from 'react'

interface IconsProps {
  color: string
  bgColor?: string
  width?: string
  height?: string
}

interface IconsTwoColorsProps extends IconsProps {
  secondary: string
}

export const TUDelftLogo = (props: IconsTwoColorsProps) => {
  const { color, secondary, width = 185, height = 72 } = props
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 185 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'none' }}
    >
      <path
        d="M53.6173 64.6872C58.2587 64.6872 60.6722 61.5397 60.6722 57.2812V35.4336H70.512V57.8367C70.3263 67.6496 62.5288 71.5377 53.6173 71.5377C44.7058 71.5377 36.7227 67.6496 36.7227 57.8367V35.4336H46.5624V57.2812C46.3767 61.7248 48.9759 64.6872 53.6173 64.6872Z"
        fill={color}
      />
      <path
        d="M11.1021 70.7971H20.9418V42.2841H31.8955V35.4336H0.148438V42.2841H11.1021V70.7971Z"
        fill={secondary}
      />
      <path
        d="M34.6804 18.2134C32.2668 18.954 29.8533 18.3986 29.8533 15.251C29.8533 10.4371 41.364 6.36384 43.0349 2.1054C43.4062 0.994504 43.4062 0.253906 43.0349 0.253906C42.6636 0.253906 43.0349 0.809354 42.1066 1.54995C37.2795 6.36384 29.2964 6.36384 23.1697 8.95593C19.0853 10.8074 7.38901 16.3619 10.1738 28.5818C10.3595 29.1372 10.7308 31.1739 11.1021 31.1739C11.4734 31.1739 11.4734 30.063 11.4734 28.5818C11.4734 21.1758 20.0136 19.1392 22.9841 14.3253C23.3554 13.7698 23.9123 13.0292 24.098 13.3995C24.098 13.5847 24.098 13.7698 24.098 14.3253C23.1697 18.2134 19.0853 20.8055 20.1992 23.5827C21.6845 27.2857 26.1402 24.5085 27.4398 22.1015C27.8111 21.5461 27.9968 20.9906 28.1824 21.1758C28.3681 21.1758 28.3681 21.9164 28.1824 22.657C27.4398 26.9154 26.5115 29.3224 23.3554 31.7293C22.4271 32.4699 20.7562 32.6551 20.9419 33.2105C20.9419 33.3957 21.6845 33.3957 22.2414 33.2105C30.5959 32.6551 37.4652 23.0273 39.3218 16.5471C39.5074 16.1768 39.5074 15.6213 39.3218 15.4362C39.1361 15.251 38.7648 15.6213 38.3935 15.9916C37.2795 16.9174 35.98 17.8431 34.6804 18.2134Z"
        fill={secondary}
      />
      <path
        d="M118.782 56.1707C118.782 52.2826 121.196 48.7647 125.095 48.7647C129.55 48.7647 131.407 51.9123 131.407 56.1707H118.782ZM136.234 59.5034V57.2816C136.234 50.4311 132.335 45.6172 125.28 45.6172C117.483 45.6172 113.77 51.7271 113.77 58.948C113.77 66.1688 116.926 71.7233 124.909 71.7233C130.85 71.7233 135.12 68.946 135.863 63.3915H130.85C130.293 66.9094 128.436 68.3906 124.909 68.3906C120.082 68.3906 118.597 64.1321 118.597 59.6885H136.234V59.5034Z"
        fill={secondary}
      />
      <path d="M146.63 35.4336H141.988V70.7971H146.63V35.4336Z" fill={secondary} />
      <path
        d="M161.297 70.7956V49.5034H167.052V46.1707H161.297V42.2825C161.297 39.5053 162.596 38.9498 165.381 38.9498C166.124 38.9498 166.866 39.135 167.794 39.135V35.2469C166.681 35.0617 165.567 34.6914 164.453 34.6914C159.997 34.6914 156.655 36.9132 156.655 41.5419V46.1707H151.828V49.5034H156.655V70.9807H161.297V70.7956Z"
        fill={secondary}
      />
      <path
        d="M169.652 46.1716V49.5043H173.922V65.242C173.922 68.5747 173.922 71.7223 180.977 71.7223C182.091 71.7223 183.02 71.5371 184.133 71.352V67.8341C183.391 68.0193 182.463 68.2044 181.72 68.2044C180.049 68.2044 178.749 67.2787 178.749 65.6123V49.6895H184.505V46.3568H178.749V39.6914L174.108 41.1726V46.3568L169.652 46.1716Z"
        fill={secondary}
      />
      <path
        d="M80.3516 70.7967H92.6048C107.829 70.7967 109.314 58.0214 109.314 53.0224C109.314 48.2085 107.643 35.248 92.6048 35.248H80.3516V70.7967ZM85.3643 39.6916H92.6048C100.774 39.6916 104.301 45.8016 104.301 53.2075C104.301 60.6135 100.959 66.7235 92.6048 66.7235H85.3643V39.6916Z"
        fill={secondary}
      />
    </svg>
  )
}

export const FileIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0,0,256,256"
      width="100px"
      height="100px"
      className="h-auto w-1/4"
    >
      <g
        fill="#00a6d6"
        fillRule="nonzero"
        stroke="none"
        strokeWidth="1"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        strokeDasharray=""
        strokeDashoffset="0"
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
        textAnchor="none"
      >
        <g transform="scale(5.12,5.12)">
          <path d="M7,2v46h36v-33.40625l-0.28125,-0.3125l-12,-12l-0.3125,-0.28125zM9,4h20v12h12v30h-32zM31,5.4375l8.5625,8.5625h-8.5625z"></path>
        </g>
      </g>
    </svg>
  )
}

export const CrossIcon = (props: IconsProps) => {
  return (
    <svg
      width={props.width ? props.width : '14'}
      height={props.height ? props.height : '14'}
      viewBox={props.width && props.height ? `0 0 ${props.width} ${props.height}` : '0 0 14 14'}
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
  )
}

export const GalleryBlockViewIcon = (props: IconsProps) => {
  return (
    <svg
      width={props.width ? props.width : '24'}
      height={props.height ? props.height : '24'}
      viewBox={props.width && props.height ? `0 0 ${props.width} ${props.height}` : '0 0 24 24'}
      fill={props.bgColor ? props.bgColor : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className="duration-170 transition-all"
    >
      <rect
        x={props.width ? (parseFloat(props.width) / 5.3333).toString() : '4.5'}
        y={props.height ? (parseFloat(props.height) / 5.3333).toString() : '4.5'}
        width={props.width ? (parseInt(props.width) / 4).toString() : '6'}
        height={props.height ? (parseInt(props.height) / 4).toString() : '6'}
        fill={props.color ? props.color : '#00A6D6'}
        stroke={props.color ? props.color : '#00A6D6'}
      />
      <rect
        x={props.width ? (parseFloat(props.width) / 5.3333).toString() : '4.5'}
        y={props.height ? (parseFloat(props.height) / 1.7777).toString() : '13.5'}
        width={props.width ? (parseInt(props.width) / 4).toString() : '6'}
        height={props.height ? (parseInt(props.height) / 4).toString() : '6'}
        fill={props.color ? props.color : '#00A6D6'}
        stroke={props.color ? props.color : '#00A6D6'}
      />
      <rect
        x={props.width ? (parseFloat(props.width) / 1.7777).toString() : '13.5'}
        y={props.height ? (parseFloat(props.height) / 5.3333).toString() : '4.5'}
        width={props.width ? (parseInt(props.width) / 4).toString() : '6'}
        height={props.height ? (parseInt(props.height) / 4).toString() : '6'}
        fill={props.color ? props.color : '#00A6D6'}
        stroke={props.color ? props.color : '#00A6D6'}
      />
      <rect
        x={props.width ? (parseFloat(props.width) / 1.7777).toString() : '13.5'}
        y={props.height ? (parseFloat(props.height) / 1.7777).toString() : '13.5'}
        width={props.width ? (parseInt(props.width) / 4).toString() : '6'}
        height={props.height ? (parseInt(props.height) / 4).toString() : '6'}
        fill={props.color ? props.color : '#00A6D6'}
        stroke={props.color ? props.color : '#00A6D6'}
      />
    </svg>
  )
}

export const GalleryListViewIcon = (props: IconsProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={props.bgColor ? props.bgColor : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className="duration-170 transition-all"
    >
      <rect x="10" y="5" width="10" height="2" fill={props.color} />
      <rect x="10" y="11" width="10" height="2" fill={props.color} />
      <rect x="10" y="17" width="10" height="2" fill={props.color} />
      <rect x="4" y="4" width="4" height="4" fill={props.color} />
      <rect x="4" y="10" width="4" height="4" fill={props.color} />
      <rect x="4" y="16" width="4" height="4" fill={props.color} />
    </svg>
  )
}

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
  )
}

export const SortIcon = (props: IconsProps) => {
  return (
    <svg
      width={props.width ? props.width : '24'}
      height={props.height ? props.height : '24'}
      viewBox={props.width && props.height ? `0 0 ${props.width} ${props.height}` : '0 0 24 24'}
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
  )
}

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
  )
}
export const ArrowNext = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.4697 32.5303C19.1768 32.2374 19.1768 31.7626 19.4697 31.4697L26.9393 24L19.4697 16.5303C19.1768 16.2374 19.1768 15.7626 19.4697 15.4697C19.7626 15.1768 20.2374 15.1768 20.5303 15.4697L28.5303 23.4697C28.8232 23.7626 28.8232 24.2374 28.5303 24.5303L20.5303 32.5303C20.2374 32.8232 19.7626 32.8232 19.4697 32.5303Z"
        fill="black"
      />
    </svg>
  )
}
export const ArrowPrev = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.5303 15.4697C28.8232 15.7626 28.8232 16.2374 28.5303 16.5303L21.0607 24L28.5303 31.4697C28.8232 31.7626 28.8232 32.2374 28.5303 32.5303C28.2374 32.8232 27.7626 32.8232 27.4697 32.5303L19.4697 24.5303C19.1768 24.2374 19.1768 23.7626 19.4697 23.4697L27.4697 15.4697C27.7626 15.1768 28.2374 15.1768 28.5303 15.4697Z"
        fill="black"
      />
    </svg>
  )
}
export const TriangleArrow = () => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3.75L6 8.25L2 3.75L10 3.75Z" fill="white" />
    </svg>
  )
}

export const LogoutIcon = (props: IconsProps) => (
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="icons">
      <path
        id="path52"
        d="M10.4906 2.25006C10.3755 2.25119 10.2618 2.27508 10.156 2.3204C10.0501 2.36573 9.9542 2.43158 9.87372 2.51418C9.79323 2.59677 9.72975 2.69455 9.68691 2.80181C9.64407 2.90908 9.62271 3.02374 9.62405 3.1393V10.1726C9.62411 10.4059 9.71643 10.6297 9.88069 10.7946C10.045 10.9595 10.2677 11.0522 10.5 11.0522C10.7323 11.0522 10.955 10.9595 11.1193 10.7946C11.2835 10.6297 11.3759 10.4059 11.3759 10.1726V3.1393C11.3773 3.02215 11.3553 2.90588 11.3113 2.79737C11.2673 2.68887 11.2021 2.59026 11.1197 2.50742C11.0372 2.42457 10.939 2.35916 10.831 2.31495C10.723 2.27075 10.6072 2.24869 10.4906 2.25006ZM15.5958 4.0131C15.5673 4.01228 15.5388 4.01285 15.5104 4.01482C15.3373 4.02957 15.1726 4.0957 15.0371 4.20476C14.9016 4.31381 14.8015 4.46085 14.7494 4.62723C14.6974 4.79361 14.6958 4.97182 14.7449 5.13911C14.7939 5.30641 14.8914 5.45525 15.025 5.56673C16.5408 6.85967 17.4998 8.78406 17.4998 10.9451C17.4998 14.8471 14.3803 17.9921 10.5043 17.9921C6.62816 17.9921 3.50187 14.8471 3.50187 10.9451C3.50188 8.79657 4.44869 6.88524 5.94938 5.59247C6.0368 5.51751 6.10868 5.42596 6.16089 5.3231C6.21311 5.22024 6.24464 5.10807 6.25369 4.99298C6.26274 4.87788 6.24913 4.76217 6.21364 4.65236C6.17815 4.54254 6.12147 4.44083 6.04684 4.35302C5.9722 4.2652 5.88108 4.19301 5.77868 4.14057C5.67627 4.08813 5.56458 4.0564 5.44999 4.04732C5.3354 4.03823 5.22015 4.05193 5.11082 4.08759C5.00148 4.12324 4.90022 4.18016 4.81279 4.25512C2.93947 5.86891 1.75001 8.27434 1.75 10.9451C1.74999 15.7955 5.68074 19.75 10.5043 19.75C15.3278 19.75 19.25 15.7955 19.25 10.9451C19.25 8.25877 18.0488 5.84344 16.1564 4.22938C16.0008 4.09313 15.8022 4.01653 15.5958 4.0131Z"
        fill={props.color}
      />
    </g>
  </svg>
)

export const AuthorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 18C4 15.7909 5.79086 14 8 14H16C18.2091 14 20 15.7909 20 18V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V18Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export const AddFileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 21C5.89543 21 5 20.1046 5 19V3H14L19 8V19C19 20.1046 18.1046 21 17 21H7Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 13V17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 15H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 3V9H19" stroke="currentColor" strokeLinejoin="round" />
  </svg>
)

export const TrashCanIcon = (props: any) => (
  <svg
    className={props?.className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 3.98763C11.78 3.76763 9.54667 3.6543 7.32 3.6543C6 3.6543 4.68 3.72096 3.36 3.8543L2 3.98763"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.66406 3.31203L5.81073 2.4387C5.9174 1.80536 5.9974 1.33203 7.12406 1.33203H8.87073C9.9974 1.33203 10.0841 1.83203 10.1841 2.44536L10.3307 3.31203"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5708 6.09375L12.1375 12.8071C12.0642 13.8537 12.0042 14.6671 10.1442 14.6671H5.86417C4.00417 14.6671 3.94417 13.8537 3.87083 12.8071L3.4375 6.09375"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.88281 11H9.10281"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.33594 8.33203H9.66927"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const SmallFileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 21C5.89543 21 5 20.1046 5 19V3H14L19 8V19C19 20.1046 18.1046 21 17 21H7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 3V8C13 8.55228 13.4477 9 14 9H19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

export const EyeIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 1.5C3.91667 1.5 1 6 1 6C1 6 3.91667 10.5 8 10.5C12.0833 10.5 15 6 15 6C15 6 12.0833 1.5 8 1.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="6" r="2.25" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)
export const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.25201 9.97523L16.9111 4.42326C18.6115 3.61355 20.3864 5.38846 19.5767 7.08885L14.0248 18.748C13.2661 20.3413 10.966 20.2427 10.3464 18.5904L9.3192 15.8512C9.11639 15.3104 8.68964 14.8836 8.14879 14.6808L5.40963 13.6536C3.75729 13.034 3.65873 10.7339 5.25201 9.97523Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="12"
      y="11.999"
      width="0.01"
      height="0.01"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <rect
      x="12"
      y="4.99902"
      width="0.01"
      height="0.01"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <rect
      x="12"
      y="18.999"
      width="0.01"
      height="0.01"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
)

export const ArrowRight = (props: any) => (
  <svg
    className={props?.className}
    width="6"
    height="12"
    viewBox="0 0 6 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.151496 11.1534C-0.0504989 10.9581 -0.0504989 10.6415 0.151496 10.4463L4.75127 5.9998L0.151496 1.55336C-0.0504993 1.3581 -0.0504993 1.04151 0.151496 0.846251C0.353491 0.650989 0.68099 0.650989 0.882986 0.84625L5.8485 5.64625C5.9455 5.74002 6 5.8672 6 5.9998C6 6.13241 5.9455 6.25959 5.8485 6.35336L0.882986 11.1534C0.680991 11.3486 0.353492 11.3486 0.151496 11.1534Z"
      fill="currentColor"
    />
  </svg>
)

export const AvatarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 12C21 13.8569 20.4376 15.5825 19.4739 17.0157C17.858 19.4189 15.1136 21 12 21C8.88636 21 6.14202 19.4189 4.52609 17.0157C3.56237 15.5825 3 13.8569 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M14.9982 15H8.99821C7.18645 15 5.65603 16.2045 5.16406 17.8564C6.81468 19.7808 9.26406 21 11.9982 21C14.7323 21 17.1817 19.7808 18.8323 17.8564C18.3404 16.2045 16.81 15 14.9982 15Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
)

export const ArrowLeft = () => (
  <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.697 0.693284C12.101 1.08381 12.101 1.71697 11.697 2.1075L2.49746 11.0004L11.697 19.8933C12.101 20.2838 12.101 20.917 11.697 21.3075C11.293 21.698 10.638 21.698 10.234 21.3075L0.302994 11.7075C0.108991 11.52 1.43241e-06 11.2656 1.44401e-06 11.0004C1.4556e-06 10.7352 0.108991 10.4808 0.302994 10.2933L10.234 0.693284C10.638 0.302759 11.293 0.302759 11.697 0.693284Z"
      fill="currentColor"
    />
  </svg>
)

export const ChevronDown = () => (
  <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.845665 0.151496C1.04093 -0.0504988 1.35751 -0.0504988 1.55277 0.151496L5.99922 4.75127L10.4457 0.151496C10.6409 -0.0504988 10.9575 -0.0504988 11.1528 0.151496C11.348 0.353492 11.348 0.680991 11.1528 0.882986L6.35277 5.8485C6.259 5.9455 6.13183 6 5.99922 6C5.86661 6 5.73943 5.9455 5.64567 5.8485L0.845665 0.882986C0.650403 0.680991 0.650403 0.353492 0.845665 0.151496Z"
      fill="currentColor"
    />
  </svg>
)

export const Arrow = (props: any) => (
  <svg
    className={props?.className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 17L15 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 12L10 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export const CheckIcon = (props: any) => (
  <svg
    width="24"
    className={props?.className}
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.5 8L10.5 16L6.5 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export const CloseIcon = (props: any) => (
  <svg
    width="21"
    className={props?.className}
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.5 6L15.5 15M6.5 15L15.5 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
