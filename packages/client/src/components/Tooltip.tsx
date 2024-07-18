import { ReactNode, useState } from 'react';
import { Transition } from '@headlessui/react';

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip = ({ children, content, position = 'bottom' }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    let positionClasses;
    switch (position) {
        case 'top':
            positionClasses = 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
            break;
        case 'bottom':
            positionClasses = 'top-full left-1/2 transform -translate-x-1/2 mt-2';
            break;
        case 'left':
            positionClasses = 'right-full top-1/2 transform -translate-y-1/2 mr-2';
            break;
        case 'right':
            positionClasses = 'left-full top-1/2 transform -translate-y-1/2 ml-2';
            break;
        default:
            positionClasses = 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }

    return (
        <div className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}>
            {children}
            <Transition
                show={isVisible}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className={`absolute ${positionClasses} z-10 w-max p-2 bg-background-secondary text-white text-sm font-semibold rounded shadow-lg`}>
                    {content}
                </div>
            </Transition>
        </div>
    );
}

export default Tooltip;
