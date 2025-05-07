const EthIcon = ({ size = 24, fill = '#627EEA', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>eth</title>
      <g clipPath="url(#clip0)">
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
          fill={fill}
        />
        <path d="M12.3735 3V9.6525L17.9963 12.165L12.3735 3Z" fill="white" fillOpacity="0.602" />
        <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white" />
        <path
          d="M12.3735 16.4769V20.9971L18 13.2129L12.3735 16.4769Z"
          fill="white"
          fillOpacity="0.602"
        />
        <path d="M12.3735 20.9971V16.4761L6.75 13.2129L12.3735 20.9971Z" fill="white" />
        <path
          d="M12.3735 15.43L17.9963 12.1653L12.3735 9.6543V15.43Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M6.75 12.1653L12.3735 15.43V9.6543L6.75 12.1653Z"
          fill="white"
          fillOpacity="0.602"
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

export default EthIcon;
