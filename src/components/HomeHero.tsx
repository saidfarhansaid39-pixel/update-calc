export function HomeHero() {
  return (
    <div className="w-full bg-gray-sub border-b border-gray-border py-4">
      <div className="mx-auto max-w-[960px] px-4 flex justify-between items-center">
        
        {/* Left side: Scientific calculator preview snippet */}
        <div className="bg-white border border-gray-border p-2 shadow-sm flex-shrink-0" style={{ width: '300px' }}>
            <div className="bg-[#4477a1] text-white text-right p-1 mb-2 font-mono text-lg font-bold h-[30px] flex items-center justify-end px-2">0</div>
            <div className="grid grid-cols-6 gap-1 text-[11px]">
               <button className="bg-[#e6e6e6] border border-gray-border p-1 font-bold hover:bg-[#d4d4d4]">sin</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 font-bold hover:bg-[#d4d4d4]">cos</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 font-bold hover:bg-[#d4d4d4]">tan</button>
               <div className="col-span-3 flex items-center text-[10px] gap-1 pl-1">
                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="angle" defaultChecked className="w-3 h-3"/> Deg</label>
                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="angle" className="w-3 h-3"/> Rad</label>
               </div>
               
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">sin⁻¹</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">cos⁻¹</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">tan⁻¹</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 font-serif italic hover:bg-[#d4d4d4]">π</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 font-serif italic hover:bg-[#d4d4d4]">e</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">xʸ</button>

               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">x³</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">x²</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">eˣ</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">10ˣ</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">y√x</button>
               <button className="bg-[#e6e6e6] border border-gray-border p-1 hover:bg-[#d4d4d4]">³√x</button>
            </div>
        </div>

        {/* Right side: Title and Search */}
        <div className="flex flex-col items-end pt-4">
          <h2 className="text-[28px] text-primary-dark font-bold mb-4 tracking-tight">Free Online Calculators</h2>
          <div className="flex">
            <input type="text" className="border border-gray-border px-2 py-1 w-[250px] shadow-inner focus:outline-none focus:border-[#999999]" />
            <button className="bg-[#4477a1] text-white px-4 py-1 border border-[#335577] hover:bg-[#335577] text-[13px] font-bold shadow-sm">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}
