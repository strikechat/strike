import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface ContextMenuProps {
    children: ReactNode;
    menuItems: ReactNode;
}

interface MenuItemProps {
    onClick: () => void;
    children: ReactNode;
}

export const ContextMenuItem: React.FC<MenuItemProps> = ({ onClick, children }) => {
    return (
        <div
            onClick={onClick}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-gray-400 flex items-center gap-2 w-full hover:cursor-pointer"
        >
            {children}
        </div>
    );
};

const ContextMenu: React.FC<ContextMenuProps> = ({ children, menuItems }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setVisible(false);

        setTimeout(() => {
            setVisible(true);
            setPosition({ x: event.clientX, y: event.clientY });
        }, 1);
    };

    return (
        <div onContextMenu={handleContextMenu} className="relative inline-block w-full">
            {children}
            {visible && (
                <div
                    ref={menuRef}
                    className="fixed z-10 w-56 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none"
                    style={{ top: position.y, left: position.x }}
                >
                    {menuItems}
                </div>
            )}
        </div>
    );
};

export default ContextMenu;
