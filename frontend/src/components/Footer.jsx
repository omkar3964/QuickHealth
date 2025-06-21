import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className=' flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/*footer left part */}
                <div>
                    <img className='mb-5 w-40' src={assets.QuickHealth} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>QuickHealth is your trusted digital healthcare partner connecting patients to experienced doctors anytime, anywhere. With secure video consultations, easy appointment booking, and instant health updates, we’re transforming how healthcare reaches you. Experience care made simple, smart, and accessible.</p>
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
                        <li>support@quickhealth.in</li>

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