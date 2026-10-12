// Bricks loader — the filled brand mark (bricks-mark.svg, exact geometry) animated two ways.
//   variant="assemble": splash / full-screen / page loads. Bricks set in (80ms stagger), hold, lift away. 2.0s loop.
//   variant="cycle":    buttons, inline, small. Mark stays intact; each brick dims in turn (90ms stagger). 1.8s loop.
// The rest frame swaps to an untouched static copy so it is pixel-identical to the logo.
// Reduced motion: static logo with a gentle opacity pulse.
// Shared across Bricks web surfaces — keep copies identical (source: ship/loader-rollout/src).
import type { CSSProperties } from 'react';

const CSS = `
.bxl{position:relative;display:inline-block;flex:none;vertical-align:middle;line-height:0}
.bxl>svg{position:absolute;left:0;top:0;display:block;overflow:visible}
.bxl-a>.bxl-st{animation:bxl-sa 2s step-end infinite}.bxl-a>.bxl-an{animation:bxl-aa 2s step-end infinite}
.bxl-a>.bxl-an rect{transform-box:view-box;animation:bxl-as 2s cubic-bezier(.16,1,.3,1) infinite backwards}
.bxl-a>.bxl-an rect:nth-child(2){animation-delay:80ms}.bxl-a>.bxl-an rect:nth-child(3){animation-delay:160ms}
@keyframes bxl-sa{0%{opacity:0}30%{opacity:1}55%{opacity:0}}
@keyframes bxl-aa{0%{opacity:1}30%{opacity:0}55%{opacity:1}}
@keyframes bxl-as{0%{opacity:0;transform:translateY(-5px);animation-timing-function:cubic-bezier(.16,1,.3,1)}21%,55%{opacity:1;transform:translateY(0);animation-timing-function:cubic-bezier(.55,0,.75,.2)}72%,100%{opacity:0;transform:translateY(-4px)}}
.bxl-c>.bxl-st{animation:bxl-sc 1.8s step-end infinite}.bxl-c>.bxl-an{animation:bxl-ac 1.8s step-end infinite}
.bxl-c>.bxl-an rect{animation:bxl-cy 1.8s infinite backwards}
.bxl-c>.bxl-an rect:nth-child(2){animation-delay:90ms}.bxl-c>.bxl-an rect:nth-child(3){animation-delay:180ms}
@keyframes bxl-sc{0%{opacity:0}46%{opacity:1}}
@keyframes bxl-ac{0%{opacity:1}46%{opacity:0}}
@keyframes bxl-cy{0%{opacity:1;animation-timing-function:cubic-bezier(.16,1,.3,1)}12%{opacity:.28;animation-timing-function:cubic-bezier(.33,0,.2,1)}36%,100%{opacity:1}}
@media (prefers-reduced-motion:reduce){
.bxl>svg,.bxl>svg rect{animation:none!important;opacity:1!important;transform:none!important}
.bxl>.bxl-an{display:none}.bxl{animation:bxl-pulse 2s ease-in-out infinite}
@keyframes bxl-pulse{0%,100%{opacity:1}50%{opacity:.6}}}
`;

let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const el = document.createElement('style');
  el.setAttribute('data-bricks-loader', '');
  el.textContent = CSS;
  document.head.appendChild(el);
}
if (typeof document !== 'undefined') inject();

function Mark({ size, color, cls }: { size: number; color: string; cls: string }) {
  return (
    <svg className={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" shapeRendering="geometricPrecision" aria-hidden="true">
      <rect x="3" y="4" width="11" height="6.4" rx="0.8" fill={color} fillOpacity={0.82} />
      <rect x="3" y="11.6" width="6" height="8.4" rx="0.8" fill={color} />
      <rect x="10.2" y="11.6" width="10.8" height="8.4" rx="0.8" fill={color} />
    </svg>
  );
}

export type BricksLoaderProps = {
  variant?: 'assemble' | 'cycle';
  size?: number;
  color?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export default function BricksLoader({ variant = 'cycle', size = 18, color = '#D2542B', label = 'Loading', className = '', style }: BricksLoaderProps) {
  inject();
  return (
    <span role="status" aria-label={label} className={`bxl ${variant === 'assemble' ? 'bxl-a' : 'bxl-c'} ${className}`} style={{ width: size, height: size, ...style }}>
      <Mark size={size} color={color} cls="bxl-st" />
      <Mark size={size} color={color} cls="bxl-an" />
    </span>
  );
}
