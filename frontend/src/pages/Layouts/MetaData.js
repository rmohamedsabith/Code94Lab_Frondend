import React from 'react'
import {Helmet} from'react-helmet-async'

const MetaData = ({title}) => {
  return (
    <Helmet>
        <title>{`${title}-Code94Labs-E-Commerce`}</title>
    </Helmet>
  )
}

export default MetaData