const CreditCoinIcon = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_2941_194091)">
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
          fill="white"
        />
        <g clipPath="url(#clip1_2941_194091)">
          <path
            d="M19.7831 8.63235L17.7586 9.20907C17.4008 8.76839 17.1574 8.23666 16.7812 7.78844C13.5489 3.93829 7.36596 5.02873 5.64085 9.78689C3.79574 14.8762 8.10922 19.9207 13.2637 18.768C15.2544 18.3229 16.7486 16.9154 17.7559 15.1612L19.8545 15.6666C18.8657 18.3262 16.4212 20.3774 13.7048 20.9782C6.96575 22.4687 1.28953 15.9641 3.47628 9.25442C5.46499 3.15212 13.1103 1.18107 17.7467 5.55387C18.5839 6.34349 19.452 7.51774 19.7831 8.63235Z"
            fill="black"
          />
          <path
            d="M13.2746 11.0503H21.9995V13.3215H13.4534C13.4231 13.3215 13.1116 13.6899 13.0225 13.7592C11.354 15.0577 9.25383 13.1597 10.1598 11.3394C10.7573 10.1389 12.5354 9.91066 13.2746 11.0503Z"
            fill="black"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_2941_194091">
          <rect width={size} height={size} fill="white" />
        </clipPath>
        <clipPath id="clip1_2941_194091">
          <rect width="19" height="18" fill="white" transform="translate(3 3.19336)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CreditCoinIcon;
