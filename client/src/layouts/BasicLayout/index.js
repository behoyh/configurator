import React from 'react'

import { Layout } from 'antd'
import MainHeader from '../MainHeader'

import './index.less'

const BasicLayout = ({ route, children }) => {
  return (
    <Layout className="main-layout">
      <Layout className="main-layout__right">
        <MainHeader />
        <Layout.Content className="main-layout__content">
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
