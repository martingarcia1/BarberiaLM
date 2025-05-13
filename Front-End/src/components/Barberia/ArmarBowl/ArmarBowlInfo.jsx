import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ArmarBowl.css';

const ArmarBowlInfo = ({ isOpen, setIsOpen, onRequestClose, productos, tipoProducto, cantidadElegir, setMostrarIcon, VerBotonPresionado, Borrar, updateSelectedItems }) => {
    if (!productos) {
        return null;
    }

    if (Borrar) {
        clearSelection();
    }

    const initialProductosElegidos = JSON.parse(localStorage.getItem('productosElegidos')) || {
        Base: [],
        Ingrediente: [],
        Proteina: [],
        Aderezo: [],
        Premium: [],
        Queso: []
    };

    const [selectedIds, setSelectedIds] = useState([]);
    const [productosElegidos, setProductosElegidos] = useState(initialProductosElegidos);

    useEffect(() => {
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'center',
                y: 'top',
            },
            types: [
                {
                    type: 'success',
                    background: "#28b463",
                    className: "rounded-[10px] text-black font-julius text-[15px]"
                },
                {
                    type: 'error',
                    background: "#e74c3c",
                    className: "rounded-[10px] text-black font-julius text-[15px]"
                },
            ]
        });
        window.notyf = notyf;
    }, []);

    const handleCheckBox = (e, id) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            if (cantidadElegir === 1) {
                setSelectedIds([id]);
            } else {
                if (selectedIds.length < cantidadElegir) {
                    setSelectedIds([...selectedIds, id]);
                } else {
                    const newSelection = [...selectedIds.slice(0, -1), id];
                    setSelectedIds(newSelection);
                }
            }
        } else {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    const handlerClick = () => {
        const limitePorTipo = {
            Base: 1,
            Ingrediente: 4,
            Proteina: 1,
            Aderezo: 2,
            Premium: 1,
            Queso: 1
        };

        if (selectedIds.length !== limitePorTipo[tipoProducto]) {
            window.notyf.error(`Debes seleccionar exactamente ${limitePorTipo[tipoProducto]} ${tipoProducto}.`);
            return;
        }

        const nuevosProductosElegidos = {
            ...productosElegidos,
            [tipoProducto]: [...selectedIds]
        };

        setProductosElegidos(nuevosProductosElegidos);
        localStorage.setItem('productosElegidos', JSON.stringify(nuevosProductosElegidos));
        updateSelectedItems(tipoProducto, productos.filter(prod => selectedIds.includes(prod.id)));
        setMostrarIcon((prev) => [...prev, VerBotonPresionado]);
        clearSelection();
        setIsOpen(false);
    };

    const clearSelection = () => {
        setSelectedIds([]);
    };

    return (
        <Modal
            className="w-full max-w-[600px] mx-auto outline-none"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalles del producto"
            style={{
                overlay: {
                    zIndex: "11",
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                content: {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '20px',
                    width: '90%',
                    maxWidth: '650px',
                    maxHeight: '85vh',
                    margin: '20px auto',
                    padding: '20px',
                    backgroundColor: "#1e5e39",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: 'none',
                    position: 'relative',
                    overflow: 'auto',
                    inset: 'auto'
                }
            }}
        >
            <button
                className="absolute top-3 right-3 w-7 h-7 text-[13px] rounded-md shadow shadow-gray-900 hover:scale-105 flex justify-center items-center cursor-pointer"
                onClick={onRequestClose}
            >
                ✕
            </button>

            <h2 className="font-julius text-2xl mb-5 text-center mt-2 text-[#e0e0e0]">
                {tipoProducto}
            </h2>

            <div className="flex flex-col font-julius bg-white rounded-2xl w-[90%] p-4 mb-5 shadow-md">
                <div className="text-[#72bf78] text-6xl text-center">OLYS</div>
                <div className="text-[#6fbb76] text-center">Oliva limon & sal</div>
            </div>

            <h3 className="font-julius text-xl mb-4 text-[#e0e0e0]">
                Elegi {cantidadElegir}
            </h3>

            <div className="w-full px-4 mb-4 text-[#e0e0e0]">
                <div className="flex flex-col gap-4 font-julius">
                    <div className="flex flex-col">
                        {productos.map((prod) => {
                            const opacidad = prod.cantidad === 0 ? "opacity-35" : "";
                            return (
                                <div key={prod.id} className="flex items-center mb-3 ml-4">
                                    <input
                                        className={`${opacidad} mr-2 appearance-none h-4 w-4 bg-[#47804a] shadow rounded checked:bg-[#e5e9e5] cursor-pointer checked:border checked:border-[#2b8135]`}
                                        type="checkbox"
                                        id={prod.id}
                                        checked={selectedIds.includes(prod.id)}
                                        disabled={prod.cantidad === 0}
                                        onChange={(e) => handleCheckBox(e, prod.id)}
                                    />
                                    <label htmlFor={prod.id} className={`${opacidad} text-lg cursor-pointer`}>
                                        {prod.nombre}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <button
                className="rounded-md text-[16px] p-2 font-julius border border-[#e0e0e0] hover:scale-105 transition-transform duration-300 mb-2 text-[#e0e0e0]"
                onClick={handlerClick}
            >
                Confirmar
            </button>
        </Modal>
    );
};

export default ArmarBowlInfo;