import { Button } from '../ui/button'

export const OAuthGoogleLoginButton = () => (
  <Button asChild>
    <a href="/api/users/oauth/google">Google Login</a>
  </Button>
)

export const OAuthLineLoginButton = () => (
  <Button asChild>
    <a href="/api/users/oauth/line">Line Login</a>
  </Button>
)
export const TestButton = () => (
  <Button asChild>
    <a href="/api/users/oauth/line?email=kang-nakub@hotmail.com">Line Login</a>
  </Button>
)
export const TestButton2 = () => (
  <Button asChild>
    <a href="/api/users/oauth/github?email=kang-nakub2@hotmail.com">Github Login</a>
  </Button>
)
