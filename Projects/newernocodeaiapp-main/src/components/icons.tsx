import type { SVGProps } from "react";

export const VercelIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      aria-label="Vercel logomark"
      role="img"
      viewBox="0 0 74 64"
      fill="currentColor"
      {...props}
    >
      <path
        d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
      ></path>
    </svg>
  );

export const SupabaseIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 28 28" 
        fill="none"
        {...props}
    >
        <path d="M14.9587 2.21735C14.4907 1.48201 13.5093 1.48201 13.0413 2.21735L2.01333 22.181C1.52943 22.9431 2.0308 24 2.97198 24H25.028C25.9692 24 26.4706 22.9431 25.9867 22.181L14.9587 2.21735Z" fill="currentColor"></path>
        <path d="M14.9587 2.21735C14.4907 1.48201 13.5093 1.48201 13.0413 2.21735L2.01333 22.181C1.52943 22.9431 2.0308 24 2.97198 24H14V2.21735H14.9587Z" fill="url(#paint0_linear_102_13)"></path>
        <defs>
            <linearGradient id="paint0_linear_102_13" x1="14" y1="24" x2="3.4" y2="20.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0"></stop>
            <stop offset="1" stopColor="white" stopOpacity="0.2"></stop>
            </linearGradient>
        </defs>
    </svg>
);

export const GitHubIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
);
