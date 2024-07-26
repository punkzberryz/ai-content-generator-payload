import { Button } from '../ui/button'

export const OAuthGoogleLoginButton = () => (
  <Button asChild>
    <a href="/api/users/oauth/authorize">OAuth Login</a>
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
