import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">用户须知</h1>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">1. 服务说明</h2>
              <p>
                本平台致力于为广大师生提供优质的初中数学课件学习资源。用户可通过注册账号获取课件浏览、学习等相关服务。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">2. 账号安全</h2>
              <p>
                用户应妥善保管自己的账号和密码，不得将账号转借、出租或转让给他人使用。因用户保管不当导致的账号安全问题，本平台不承担责任。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">3. 使用规范</h2>
              <p>
                用户在使用本平台服务时，必须遵守国家相关法律法规，不得发布违法违规内容，不得传播有害信息。如发现违规行为，本平台有权暂停或终止其服务。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">4. 知识产权</h2>
              <p>
                本平台提供的课件资源及相关内容的知识产权归本平台或原作者所有。用户仅可个人学习使用，不得擅自复制、传播、用于商业用途。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">5. 会员服务</h2>
              <p>
                本平台提供会员服务，会员用户可享受更多课件内容和更优质的服务。会员费用根据不同套餐确定，用户可自行选择。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">6. 免责声明</h2>
              <p>
                本平台会尽力保证服务的稳定性和内容的质量，但不对服务中断、内容错误等因不可抗力或第三方原因造成的问题承担责任。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">7. 联系方式</h2>
              <p>
                如有任何问题或建议，欢迎通过客服反馈渠道与我们联系，我们将竭诚为您服务。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">8. 更新说明</h2>
              <p>
                本用户须知如有更新，将在平台上发布公告。用户继续使用本平台服务即视为同意遵守更新后的用户须知。
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/auth"
              className="text-primary hover:underline"
            >
              ← 返回登录页面
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
