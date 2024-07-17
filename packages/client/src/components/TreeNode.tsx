import React, { useState } from 'react';

interface TranslationNode {
    name: string;
    pl: string;
    en: string;
    children?: TranslationNode[];
    toggled?: boolean;
    active?: boolean;
}

interface TreeNodeProps {
    node: TranslationNode;
    onSelect: (node: TranslationNode) => void;
    onAdd: (parentNode: TranslationNode) => void;
    onEditName: (node: TranslationNode, newName: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, onSelect, onAdd, onEditName }) => {
    const [toggled, setToggled] = useState(node.toggled || false);
    const [isEditing, setIsEditing] = useState(false);
    const [newKeyName, setNewKeyName] = useState(node.name);

    const handleToggle = () => {
        setToggled(!toggled);
        node.toggled = !toggled;
    };

    const handleDoubleClick = () => {
        if (!node.children || node.children.length === 0) {
            setIsEditing(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            onEditName(node, newKeyName);
        }
    };

    return (
        <div className="ml-4">
            <div className="flex items-center mb-2">
                {node.children && node.children.length > 0 && (
                    <button onClick={handleToggle} className="mr-2 text-gray-400">
                        {toggled ? '-' : '+'}
                    </button>
                )}
                {isEditing ? (
                    <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => setIsEditing(false)}
                        className="border p-1 mr-2 text-sm bg-gray-800 text-gray-200"
                    />
                ) : (
                    <div
                        onClick={() =>  onSelect(node)}
                        onDoubleClick={handleDoubleClick}
                        className={`cursor-pointer ${node.active ? 'font-bold text-gray-200' : 'text-gray-400'}`}
                    >
                        {node.name}
                    </div>
                )}
                <button onClick={() => onAdd(node)} className="ml-2 text-gray-400">+</button>
            </div>
            {toggled && node.children && (
                <div className="ml-4">
                    {node.children.map((childNode, index) => (
                        <TreeNode
                            key={index}
                            node={childNode}
                            onSelect={onSelect}
                            onAdd={onAdd}
                            onEditName={onEditName}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;
