const CoreIcon = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_2401_310449)">
        <rect
          x="-4"
          y="-4"
          width="32"
          height="32"
          fill="url(#pattern0_2401_310449)"
        />
      </g>
      <defs>
        <pattern
          id="pattern0_2401_310449"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use transform="scale(0.00111111)" />
        </pattern>
        <clipPath id="clip0_2401_310449">
          <rect width="24" height="24" fill="white" />
        </clipPath>
        <image
          id="image0_2401_310449"
          width="900"
          height="900"
          preserveAspectRatio="none"
        />
      </defs>
    </svg>
  );
};

export default CoreIcon;
