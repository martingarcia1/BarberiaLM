import pelado from "/img/Pelado.png";

const PeladoComponent = () => {
    return (
        <div id='Panel' className="border-[5px]  border-[#1c5734] border-opacity-80 shadow-lg rounded-[30px]  bg-[#0A4B2E] bg-opacity-5 flex flex-col mt-[150px] mx-12 movil-s:mx-7 movil-sm:">
            <div id="Titulo-Olys" className="relative cursor-pointer left-6 font-julius text-opacity-90 text-[#0E3C09] max-a:text-6xl 700-md:left-5 movil-m:text-[45px] movil-m:left-2  movil-s:text-[40px]  movil-s:left-4 movil-sm:text-[50px] movil-sm:left-2 movil-sm:mb-2 text-7xl  text-center mt-6">
                <h1 className='hover:scale-110 transition-transform duration-300 text-[#e0e0e0]'>La Barbería LM</h1>
            </div>

            <div className="flex justify-center items-center">
                <div id="Subtitulo-Bowls-Izquierdo" className=" movil-sm:hidden transform -rotate-90 cursor-pointer hover:scale-110 transition-transform duration-300">
                    <span className="max-xd:text-5xl max-a:text-[42px] max-e:text-[38px]  700-md:text-[30px]  movil-m:text-[22px]   movil-s:text-[18px] movil-sm:text-[14px] inline-block text-center rounded-[20px] bg-[#1e5e39] px-4 py-2 shadow-lg font-julius text-[#e0e0e0] text-6xl">
                        Estilo <br /> y Tradición
                    </span>
                </div>

                <div id="Pelado" className="mx-4 cursor-pointer movil-sm:hidden ">
                    <img src={pelado} alt="Pelado" />
                </div>

                <div id="Subtitulo-Bowls-Derecho" className=" movil-sm:hidden transform rotate-90 cursor-pointer hover:scale-110 transition-transform duration-300">
                    <span className="max-xd:text-5xl  max-a:text-[42px] max-e:text-[38px] 700-md:text-[30px] movil-m:text-[22px]  movil-s:text-[18px] movil-sm:text-[14px] inline-block text-center rounded-[20px] bg-[#1e5e39] px-4 py-2 shadow-lg font-julius text-[#e0e0e0] text-6xl">
                        Estilo <br /> y Tradición
                    </span>
                </div>
            </div>
        </div>)
}

export default PeladoComponent;