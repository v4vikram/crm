import React from 'react';
import Modal from './Modal';

const DynamicViewModal = ({
    isOpen,
    onClose,
    title,
    data,
    columns,
    children,
    maxWidth = 'max-w-2xl'
}) => {
    if (!data) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth}>
            <div className="grid grid-cols-2 gap-6 mb-8">
                {columns.map((col, index) => (
                    <div key={index} className={col.fullWidth ? "col-span-2" : "col-span-1"}>
                        <h3 className="text-sm font-medium text-gray-500">{col.label}</h3>
                        <div className="mt-1 text-gray-900">
                            {col.render ? col.render(data) : (data[col.key] || 'N/A')}
                        </div>
                    </div>
                ))}
            </div>
            {children}
        </Modal>
    );
};

export default DynamicViewModal;
