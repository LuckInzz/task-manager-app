

const CalendarPage = () => {
    return (
        <div className="p-4 sm:p-6 md:p-8 text-slate-500">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-[32px] text-black">Calendar</h1>
            </div>

            <div className="flex items-center justify-center mt-8 mb-8">
                <h1 className="font-bold text-[20px]">Mes/Ano</h1>
            </div>

            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm">
                <div className="grid grid-cols-7 gap-1">
                    <div className="text-center font-semibold py-2">Dom</div>
                    <div className="text-center font-semibold py-2">Seg</div>
                    <div className="text-center font-semibold py-2">Ter</div>
                    <div className="text-center font-semibold py-2">Qua</div>
                    <div className="text-center font-semibold py-2">Qui</div>
                    <div className="text-center font-semibold py-2">Sex</div>
                    <div className="text-center font-semibold py-2">Sab</div>
                </div>
            </div>
        </div>
    )
}

export default CalendarPage;