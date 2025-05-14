import type React from 'react';

interface SvgIconProps {
  width?: number;
  height?: number;
  fill?: string;
  secondaryFill?: string;
}

const UsdtIcon: React.FC<SvgIconProps> = ({
  width = 24,
  height = 24,
  fill = '#26A17B',
  secondaryFill = 'white',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>usdt</title>
      <g clipPath="url(#clip0)">
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
          fill={fill}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.4416 13.0382V13.0367C13.3591 13.0427 12.9338 13.0682 11.9851 13.0682C11.2276 13.0682 10.6943 13.0457 10.5068 13.0367V13.039C7.59085 12.9107 5.41435 12.403 5.41435 11.7955C5.41435 11.1887 7.59085 10.681 10.5068 10.5505V12.5335C10.6973 12.547 11.2433 12.5792 11.9978 12.5792C12.9031 12.5792 13.3568 12.5417 13.4416 12.5342V10.552C16.3516 10.6817 18.5228 11.1895 18.5228 11.7955C18.5228 12.403 16.3516 12.9092 13.4416 13.0382ZM13.4416 10.3457V8.57123H17.5021V5.86523H6.44635V8.57123H10.5068V10.345C7.20685 10.4965 4.7251 11.1505 4.7251 11.9335C4.7251 12.7165 7.20685 13.3697 10.5068 13.522V19.2085H13.4416V13.5205C16.7363 13.369 19.2121 12.7157 19.2121 11.9335C19.2121 11.1512 16.7363 10.498 13.4416 10.3457Z"
          fill={secondaryFill}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default UsdtIcon;
