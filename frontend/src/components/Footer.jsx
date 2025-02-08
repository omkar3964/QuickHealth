import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className=' flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/*footer left part */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab beatae eos consectetur quisquam? Quidem exercitationem veniam dicta tempore quia cupiditate ut ullam eius suscipit molestiae. Incidunt rem aliquid obcaecati placeat?</p>
                </div>

                {/*footer center part */}
                <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>

                </div>
                {/*footer rigth part */}
                <div>
                    <p className='text-xl font-medium mb-5'>Get in touch</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91-34-5476-57</li>
                        <li>abc@gmial.com</li>

                    </ul>

                </div>
            </div>
                <div>
                    <hr />
                    <p className='py-5 text-sm text-center'>Copyright 2024@ QuickHealth  - All Right Reserved.</p>
                </div>
        </div>
    )
}

export default Footer