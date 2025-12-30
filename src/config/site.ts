export const siteConfig = {
  name: '初中数学课件网',
  description: '面向初中师生提供数学课件浏览、学习的专业化平台',
  
  // Logo配置
  logo: {
    // Logo图片URL（将logo图片上传后替换这里的URL）
    url: '/logo.png',
    // Logo显示的文字（当没有图片时显示）
    text: '初中数学课件网',
    // Logo高度（单位：px）
    height: 60,
  },
  
  // 网站URL
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}
