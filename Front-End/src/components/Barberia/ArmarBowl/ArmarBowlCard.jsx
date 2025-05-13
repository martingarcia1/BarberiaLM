import React from 'react';
import { CiCircleCheck } from "react-icons/ci";

const ArmarBowlCard = ({ product, openModal,setSetVerBotonPresionado,mostrarIcon }) => {
    return (
        <div key={product.id} className={`shadow-2xl border border-black border-opacity-10 bg-[#1e5e39] rounded-t-[35px] rounded-b-[10px] w-[320px] h-[450px] flex flex-col justify-between items-center group hover:h-[500px] transition-all duration-300 text-[#e0e0e0]`}>
            <div className="img w-full h-[75%] overflow-hidden rounded-t-[35px]">
                <img className='w-full h-full object-cover' src={product.img} alt={product.name} />
            </div>
            <div className='info-container w-full p-4  flex flex-col items-center'>
                <h3 className='text-xl font-bold font-julius text-center'>{product.name}</h3>
            </div>
            <div className='boton w-full flex justify-center items-center h-0 group-hover:h-[25%] z-10 overflow-hidden transition-all duration-300 rounded-b-[10px] space-x-4'>               
                <button onClick={() =>{openModal(product);setSetVerBotonPresionado(product.id);} } className='relative w-56 h-12  border border-[#e0e0e0] hover:scale-105 rounded-lg transition-transform duration-300  focus:outline-none font-julius'>
                    Ver mas
                </button>
                
            </div>
            <div>{mostrarIcon.includes(product.id) ? (<CiCircleCheck className='text-4xl' />) : (<div></div>)}</div>
        </div>
    );
};

export default ArmarBowlCard;