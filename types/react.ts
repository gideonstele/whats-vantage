import { ForwardRefExoticComponent, RefAttributes } from 'react';

import { LucideProps } from 'lucide-react';

export type IconType = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
