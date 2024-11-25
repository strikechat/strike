import React, { useState, useRef, useEffect } from 'react';
import { FaChevronRight, FaChevronDown, FaPlus } from 'react-icons/fa';

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
    selectedNode: TranslationNode | null;
    onRename: (node: TranslationNode, newName: string) => void;
    onAddNode: (parentNode: TranslationNode) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, onSelect, selectedNode, onRename, onAddNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(node.name);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node;
    const pressTimeoutRef = useRef<NodeJS.Timeout>();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleMouseDown = () => {
        pressTimeoutRef.current = setTimeout(() => {
            setIsEditing(true);
            setNewName(node.name);
        }, 500); // 500ms long press
    };

    const handleMouseUp = () => {
        if (pressTimeoutRef.current) {
            clearTimeout(pressTimeoutRef.current);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
        if (!hasChildren) {
            onSelect(node);
        }
    };

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddNode(node);
        setIsExpanded(true);
    };

    const handleRenameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim() && newName !== node.name) {
            onRename(node, newName.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRenameSubmit(e);
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setNewName(node.name);
        }
    };

    return (
        <div className="select-none">
            {isEditing ? (
                <form onSubmit={handleRenameSubmit} className="py-1 px-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={handleKeyDown}
                        className="w-full p-1 bg-background-secondary rounded border border-gray-700 text-white text-sm"
                    />
                </form>
            ) : (
                <div className="group relative">
                    <div
                        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-700 rounded ${
                            isSelected ? 'bg-blue-500 hover:bg-blue-600' : ''
                        }`}
                        onClick={handleClick}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                            {hasChildren && (
                                isExpanded ? <FaChevronDown className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />
                            )}
                        </div>
                        <span className="truncate flex-grow">{node.name}</span>
                        <button
                            onClick={handleAddClick}
                            className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-gray-600 rounded transition-opacity"
                            title="Add child node"
                        >
                            <FaPlus className="w-3 h-3 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}
            {hasChildren && isExpanded && (
                <div className="ml-4">
                    {node.children!.map((child, index) => (
                        <TreeNode
                            key={`${child.name}-${index}`}
                            node={child}
                            onSelect={onSelect}
                            selectedNode={selectedNode}
                            onRename={onRename}
                            onAddNode={onAddNode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;
