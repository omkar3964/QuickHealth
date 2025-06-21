import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Support from '../components/Support'

const Home = () => {
  return (
    <div>
        <Support/>
        <Header/>
        <SpecialityMenu/>
        <TopDoctors/>
        <Banner/>
    </div>
  )
}

export default Home