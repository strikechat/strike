import React, { useState, useEffect } from 'react';
import TreeNode from './TreeNode';
import toast from 'react-hot-toast';

interface TranslationNode {
    name: string;
    pl: string;
    en: string;
    children?: TranslationNode[];
    toggled?: boolean;
    active?: boolean;
}

const Translations: React.FC = () => {
    const [translations, setTranslations] = useState<TranslationNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<TranslationNode | null>(null);
    const [plValue, setPlValue] = useState('');
    const [enValue, setEnValue] = useState('');

    useEffect(() => {
        loadTranslations();
    }, []);

    useEffect(() => {
        if (selectedNode) {
            setPlValue(selectedNode.pl || '');
            setEnValue(selectedNode.en || '');
        }
    }, [selectedNode]);

    const loadTranslations = async () => {
        try {
            const [plResponse, enResponse] = await Promise.all([
                fetch('/locales/pl/translation.json'),
                fetch('/locales/en/translation.json')
            ]);

            const [plData, enData] = await Promise.all([
                plResponse.json(),
                enResponse.json()
            ]);
            
            const mergedTranslations = mergeTranslations(plData, enData);
            setTranslations(mergedTranslations);
        } catch (error) {
            console.error('Error loading translations:', error);
            toast.error('Failed to load translations');
        }
    };

    const mergeTranslations = (plData: any, enData: any, parentKey = ''): TranslationNode[] => {
        const allKeys = new Set([...Object.keys(plData), ...Object.keys(enData)]);
        return Array.from(allKeys).map(key => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            const plValue = plData[key];
            const enValue = enData[key];

            if (typeof plValue === 'object' || typeof enValue === 'object') {
                return {
                    name: key,
                    pl: '',
                    en: '',
                    children: mergeTranslations(
                        plValue || {},
                        enValue || {},
                        fullKey
                    )
                };
            }

            return {
                name: key,
                pl: plValue || '',
                en: enValue || ''
            };
        });
    };

    const flattenTranslations = (nodes: TranslationNode[], parentKey = ''): { pl: Record<string, string>, en: Record<string, string> } => {
        const result: { pl: Record<string, string>, en: Record<string, string> } = { pl: {}, en: {} };
        
        const flattenNode = (node: TranslationNode, currentKey: string) => {
            if (node.children) {
                node.children.forEach(childNode => {
                    const childKey = currentKey ? `${currentKey}.${childNode.name}` : childNode.name;
                    flattenNode(childNode, childKey);
                });
            } else {
                result.pl[currentKey] = node.pl;
                result.en[currentKey] = node.en;
            }
        };

        nodes.forEach(node => {
            const currentKey = parentKey ? `${parentKey}.${node.name}` : node.name;
            flattenNode(node, currentKey);
        });
        
        return result;
    };

    const saveTranslations = async () => {
        try {
            // const { pl, en } = flattenTranslations(translations);
            
            // TODO: Send translations to backend
            // POST, body: JSON.stringify({ pl, en })        
            throw new Error('Failed to save translations');
        } catch (error) {
            console.error('Error saving translations:', error);
            toast.error('Failed to save translations');
        }
    };

    const handleNodeSelect = (node: TranslationNode) => {
        setSelectedNode(node);
    };

    const updateTranslationValue = (value: string, language: 'pl' | 'en') => {
        if (!selectedNode) return;

        const updateNodeInTree = (nodes: TranslationNode[]): TranslationNode[] => {
            return nodes.map(node => {
                if (node === selectedNode) {
                    return { ...node, [language]: value };
                }
                if (node.children) {
                    return { ...node, children: updateNodeInTree(node.children) };
                }
                return node;
            });
        };

        setTranslations(updateNodeInTree(translations));
        if (language === 'pl') setPlValue(value);
        if (language === 'en') setEnValue(value);
    };

    const handleRename = (node: TranslationNode, newName: string) => {
        const updateNodeName = (nodes: TranslationNode[]): TranslationNode[] => {
            return nodes.map(n => {
                if (n === node) {
                    return { ...n, name: newName };
                }
                if (n.children) {
                    return { ...n, children: updateNodeName(n.children) };
                }
                return n;
            });
        };

        setTranslations(updateNodeName(translations));
    };

    const handleAddNode = (parentNode: TranslationNode) => {
        const newNode: TranslationNode = {
            name: 'new_key',
            pl: '',
            en: '',
            children: []
        };

        const addNodeToTree = (nodes: TranslationNode[]): TranslationNode[] => {
            return nodes.map(node => {
                if (node === parentNode) {
                    return {
                        ...node,
                        children: [...(node.children || []), newNode]
                    };
                }
                if (node.children) {
                    return { ...node, children: addNodeToTree(node.children) };
                }
                return node;
            });
        };

        setTranslations(addNodeToTree(translations));
    };

    const handleAddRootNode = () => {
        const newNode: TranslationNode = {
            name: 'new_root_key',
            pl: '',
            en: '',
            children: []
        };
        setTranslations([...translations, newNode]);
    };

    return (
        <div className="flex h-full">
            <div className="w-1/3 h-full overflow-auto bg-background-primary p-4 border-r border-gray-700">
                <div className="mb-4">
                    <button
                        onClick={handleAddRootNode}
                        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white flex items-center justify-center"
                    >
                        <span className="mr-2">Add Root Key</span>
                    </button>
                </div>
                {translations.map((node, index) => (
                    <TreeNode
                        key={`${node.name}-${index}`}
                        node={node}
                        onSelect={handleNodeSelect}
                        selectedNode={selectedNode}
                        onRename={handleRename}
                        onAddNode={handleAddNode}
                    />
                ))}
            </div>
            <div className="flex-1 p-4 bg-background-secondary">
                {selectedNode ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Polish Translation</label>
                            <textarea
                                value={plValue}
                                onChange={(e) => updateTranslationValue(e.target.value, 'pl')}
                                className="w-full h-32 p-2 bg-background-primary rounded border border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">English Translation</label>
                            <textarea
                                value={enValue}
                                onChange={(e) => updateTranslationValue(e.target.value, 'en')}
                                className="w-full h-32 p-2 bg-background-primary rounded border border-gray-700 text-white"
                            />
                        </div>
                        <button
                            onClick={saveTranslations}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                        >
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        Select a translation key to edit
                    </div>
                )}
            </div>
        </div>
    );
};

export default Translations;
