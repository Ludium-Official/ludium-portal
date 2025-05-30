const BaseIcon = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.9791 24C18.618 24 24 18.6274 24 12C24 5.37258 18.618 0 11.9791 0C5.68039 0 0.513181 4.83591 0 10.9913H15.8889V13.0087H8.62969e-08C0.513182 19.1641 5.68039 24 11.9791 24Z"
        fill="#0052FF"
      />
    </svg>
  );
};

export default BaseIcon;
