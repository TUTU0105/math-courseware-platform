import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  // 创建超级管理员
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'super',
      phone: '13800000000'
    }
  })
  console.log('创建管理员:', admin.username)

  // 创建内容管理员
  const contentAdmin = await prisma.admin.upsert({
    where: { username: 'content_admin' },
    update: {},
    create: {
      username: 'content_admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'content',
      phone: '13800000001'
    }
  })
  console.log('创建内容管理员:', contentAdmin.username)

  // 创建数据管理员
  const dataAdmin = await prisma.admin.upsert({
    where: { username: 'data_admin' },
    update: {},
    create: {
      username: 'data_admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'data',
      phone: '13800000002'
    }
  })
  console.log('创建数据管理员:', dataAdmin.username)

  // 创建系统配置
  const config = await prisma.systemConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      phoneVerify: false,
      defaultFreeDays: 7,
      monthlyPrice: 29.9,
      quarterlyPrice: 79.9,
      yearlyPrice: 299.9,
      footerInfo: '初中数学课件网 © 2024 版权所有'
    }
  })
  console.log('创建系统配置')

  // 创建示例课件
  const coursewares = [
    {
      press: '人教版',
      grade: '七年级',
      chapter: '第一章',
      menu1: '有理数',
      menu2: '有理数的概念',
      name: '有理数的概念',
      content: '<h1>有理数的概念</h1><p>有理数是可以表示为两个整数之比的数...</p>'
    },
    {
      press: '人教版',
      grade: '七年级',
      chapter: '第一章',
      menu1: '有理数',
      menu2: '有理数的运算',
      name: '有理数的运算',
      content: '<h1>有理数的运算</h1><p>有理数的运算包括加法、减法、乘法、除法...</p>'
    },
    {
      press: '人教版',
      grade: '七年级',
      chapter: '第二章',
      menu1: '整式的加减',
      menu2: '整式',
      name: '整式',
      content: '<h1>整式</h1><p>整式是单项式和多项式的统称...</p>'
    },
    {
      press: '人教版',
      grade: '八年级',
      chapter: '第十一章',
      menu1: '三角形',
      menu2: '三角形的边',
      name: '三角形的边',
      content: '<h1>三角形的边</h1><p>三角形是由三条线段首尾相连组成的图形...</p>'
    },
    {
      press: '人教版',
      grade: '八年级',
      chapter: '第十二章',
      menu1: '全等三角形',
      menu2: '全等三角形的判定',
      name: '全等三角形的判定',
      content: '<h1>全等三角形的判定</h1><p>全等三角形是指能够完全重合的两个三角形...</p>'
    },
    {
      press: '人教版',
      grade: '九年级',
      chapter: '第二十一章',
      menu1: '一元二次方程',
      menu2: '一元二次方程的解法',
      name: '一元二次方程的解法',
      content: '<h1>一元二次方程的解法</h1><p>一元二次方程的解法包括配方法、公式法、因式分解法...</p>'
    }
  ]

  for (const cw of coursewares) {
    const courseware = await prisma.courseware.upsert({
      where: { id: `cw_${cw.name}` },
      update: {},
      create: {
        id: `cw_${cw.name}`,
        ...cw
      }
    })
    console.log('创建课件:', courseware.name)

    // 创建导航项
    await prisma.navigation.upsert({
      where: { id: `nav_${cw.name}` },
      update: {},
      create: {
        id: `nav_${cw.name}`,
        menu1Name: cw.menu1,
        menu2Name: cw.menu2,
        coursewareId: courseware.id,
        sort: 1,
        status: 'active'
      }
    })
  }

  console.log('数据库初始化完成!')
}

main()
  .catch((e) => {
    console.error('初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
