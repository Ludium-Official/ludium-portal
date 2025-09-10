/// <reference types="vite/client" />

// SVGR module declarations for importing SVGs as React components
declare module '*.svg?react' {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
