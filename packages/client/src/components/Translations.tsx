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
    const [data, setData] = useState<TranslationNode>({ name: 'translations', pl: '', en: '', children: [] });
    const [selectedNode, setSelectedNode] = useState<TranslationNode | null>(null);
    const [translations, setTranslations] = useState<{ pl: string; en: string }>({ pl: '', en: '' });

    useEffect(() => {
        const plTranslations = {
            "app": {
                "test": "testowanie",
                "greeting": "cześć",
                "farewell": "do widzenia",
                "user": {
                    "name": "nazwa",
                    "profile": "profil"
                }
            }
        };

        const enTranslations = {
            "app": {
                "test": "testing",
                "greeting": "hello",
                "farewell": "goodbye",
                "user": {
                    "name": "name",
                    "profile": "profile"
                }
            }
        };

        const transformData = (key: string, plValue: any, enValue: any): TranslationNode => {
            const node: TranslationNode = { name: key, pl: plValue, en: enValue, children: [] };
            if (typeof plValue === 'object' && typeof enValue === 'object') {
                node.children = Object.keys(plValue).map(childKey => transformData(childKey, plValue[childKey], enValue[childKey]));
            }
            return node;
        };

        const rootNode = transformData('translations', plTranslations, enTranslations);
        setData(rootNode);
    }, []);

    const handleSelect = (node: TranslationNode) => {
        if (!node.children || node.children.length === 0) {
            if (selectedNode) {
                selectedNode.active = false;
            }
            node.active = true;
            setSelectedNode(node);
            setTranslations({ pl: node.pl, en: node.en });
            setData(Object.assign({}, data));
        }
    };

    const handleInputChange = (lang: 'pl' | 'en', value: string) => {
        setTranslations({ ...translations, [lang]: value });
    };

    const handleSave = () => {
        const updateNode = (node: TranslationNode, key: string, value: { pl: string; en: string }): TranslationNode => {
            if (node.name === key) {
                node.pl = value.pl;
                node.en = value.en;
            }
            if (node.children) {
                node.children = node.children.map(child => updateNode(child, key, value));
            }
            return node;
        };

        if (selectedNode) {
            const updatedData = updateNode(data, selectedNode.name, translations);
            setData(updatedData);
            toast.success('Translations saved successfully!');
        }
    };

    const handleAdd = (parentNode: TranslationNode) => {
        const newNode: TranslationNode = { name: 'new_key', pl: '', en: '', children: [] };
        if (!parentNode.children) {
            parentNode.children = [];
        }
        parentNode.children.push(newNode);
        setData(Object.assign({}, data));
        toast.success('New key added successfully!');
    };

    const handleEditName = (node: TranslationNode, newName: string) => {
        const updateNodeName = (node: TranslationNode, key: string, newName: string): TranslationNode => {
            if (node.name === key) {
                node.name = newName;
            }
            if (node.children) {
                node.children = node.children.map(child => updateNodeName(child, key, newName));
            }
            return node;
        };

        const updatedData = updateNodeName(data, node.name, newName);
        setData(updatedData);
        toast.success('Name updated successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <h1 className="text-2xl font-bold mb-4">Translations</h1>
            <div className="flex">
                <div className="flex-1 border p-4 rounded bg-gray-800">
                    <TreeNode node={data} onSelect={handleSelect} onAdd={handleAdd} onEditName={handleEditName} />
                </div>
                <div className="flex-1 border p-4 rounded bg-gray-800 ml-4">
                    {selectedNode ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">{selectedNode.name}</h2>
                            <div className="mb-4">
                                <label className="block mb-1 font-semibold">Polish</label>
                                <input
                                    type="text"
                                    value={translations.pl}
                                    onChange={(e) => handleInputChange('pl', e.target.value)}
                                    className="border p-2 w-full bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-semibold">English</label>
                                <input
                                    type="text"
                                    value={translations.en}
                                    onChange={(e) => handleInputChange('en', e.target.value)}
                                    className="border p-2 w-full bg-gray-700 text-gray-200"
                                />
                            </div>
                            <button onClick={handleSave} className="mt-2 p-2 bg-blue-500 text-white">Save</button>
                        </div>
                    ) : (
                        <div className="text-gray-500">Select a node to edit its translations</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Translations;
