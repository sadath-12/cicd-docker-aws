import { Divider } from '@mui/material'
import React from 'react'
import { BsFilter } from 'react-icons/bs'
import { languages, categories } from '../dummy';
import Button from './Button';

const Filters = ({ data, applyFilters, clearFilters, setData }) => {
    const handleChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value })
    }
    return (
        <div className='flex flex-col'>
            <div className="p-3 top-0 w-full flex items-center justify-between">
                <h3 className='text-xl lg:text-2xl font-semibold'>Filters</h3>
                <BsFilter className='text-2xl' />
            </div>
            <Divider />
            <div className="flex flex-col gap-4 p-3">
                <div className="flex flex-col gap-2">
                    <label htmlFor="language">Select Language</label>
                    <select required name="language" onChange={handleChange} className='input' id="language">
                        <option selected value={'all'}>
                            All
                        </option>
                        {languages.map((language, i) => (
                            <option value={language.name}>
                                {language.name.slice(0, 50)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="category">Select Category</label>
                    <select required name="category" onChange={handleChange} className='input' id="category">
                        <option selected value={'all'}>
                            All
                        </option>
                        {categories.map((category, i) => (
                            <option value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="category">Price Filter (USD)</label>
                    <div className="flex w-full gap-2 items-center">
                        <input type="number" className='input !w-full' value={data.price_from} name="price_from" id="price_from" onChange={handleChange} placeholder='From Price' />
                        <span className='text-base font-semibold opacity-90'>TO</span>
                        <input type="number" className='input !w-full' value={data.price_to} name="price_to" id="price_to" onChange={handleChange} placeholder='To Price ' />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="category">Age Filter (years)</label>
                    <div className="flex w-full gap-2 items-center">
                        <input type="text" className='input !w-full' value={data.year_from} name="year_from" id="year_from" onChange={handleChange} placeholder='From Price' />
                        <span className='text-base font-semibold opacity-90'>TO</span>
                        <input type="text" className='input !w-full' value={data.year_to} name="year_to" id="year_to" onChange={handleChange} placeholder='To Price ' />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="category">DA Filter</label>
                    <div className="flex w-full gap-2 items-center">
                        <input type="text" className='input !w-full' value={data.da_from} name="da_from" id="da_from" onChange={handleChange} placeholder='From Price' />
                        <span className='text-base font-semibold opacity-90'>TO</span>
                        <input type="text" className='input !w-full' value={data.da_to} name="da_to" id="da_to" onChange={handleChange} placeholder='To Price ' />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="category">PA Filter</label>
                    <div className="flex w-full gap-2 items-center">
                        <input type="text" className='input !w-full' value={data.pa_from} name="pa_from" id="pa_from" onChange={handleChange} placeholder='From Price' />
                        <span className='text-base font-semibold opacity-90'>TO</span>
                        <input type="text" className='input !w-full' value={data.pa_to} name="pa_to" id="pa_to" onChange={handleChange} placeholder='To Price ' />
                    </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                    <label htmlFor="category">DR Filter</label>
                    <div className="flex w-full gap-2 items-center">
                        <input type="text" className='input !w-full' value={data.dr_from} name="dr_from" id="dr_from" onChange={handleChange} placeholder='From Price' />
                        <span className='text-base font-semibold opacity-90'>TO</span>
                        <input type="text" className='input !w-full' value={data.dr_to} name="dr_to" id="dr_to" onChange={handleChange} placeholder='To Price ' />
                    </div>
                </div> */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="category">Traffic Filter</label>
                    <div className="flex w-full gap-2 items-center">
                        <input type="text" className='input !w-full' value={data.traffic_from} name="traffic_from" id="traffic_from" onChange={handleChange} placeholder='From Price' />
                        <span className='text-base font-semibold opacity-90'>TO</span>
                        <input type="text" className='input !w-full' value={data.traffic_to} name="traffic_to" id="traffic_to" onChange={handleChange} placeholder='To Price ' />
                    </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                    <label htmlFor="category">Link Type</label>
                    <div className="flex w-full gap-2 items-center">
                        <input type="text" className='input !w-full' value={data.link_type} name="link_type" id="link_type" onChange={handleChange} placeholder='From Price' />
                    </div>
                </div> */}
                <div className="sticky flex flex-col border-t bg-white z-20 gap-4 py-3 bottom-0">
                    <button className='w-full' onClick={applyFilters}>
                        <Button text={'Apply Filters'} fluid />
                    </button>
                    <button className='w-full' onClick={clearFilters}>
                        <Button text='Clear Filters' gray fluid />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Filters