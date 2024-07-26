import Link from 'next/link'
import { FetchUser } from '../components/fetch-user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignInForm } from './components/signin-form'
import { OAuthGoogleLoginButton, OAuthLineLoginButton, TestButton } from '@/components/oauth'
import { OAuthLineLoginButton2 } from '@/components/oauth/line-signup-button'
const SignInPage = () => {
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-center">Restaurant Management System</h1>
      <Card className="md:w-[500px]">
        <CardHeader className="text-center">
          <CardTitle>ล็อคอินเข้าสู่ระบบ</CardTitle>
          <CardDescription>ล็อคอินพื่อใช้งานระบบจัดการร้านอาหาร</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <FetchUser>
            <SignInForm />
            <Link
              className="text-center text-indigo-600 hover:text-indigo-400 hover:underline"
              href="/auth/signup"
            >
              สมัครสมาชิก
            </Link>
          </FetchUser>
          <OAuthGoogleLoginButton />
          {/* <OAuthLineLoginButton /> */}
          <TestButton />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage
