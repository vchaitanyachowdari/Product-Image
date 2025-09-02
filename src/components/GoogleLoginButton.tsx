
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const GoogleLoginButton = () => {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    console.log('Login Success:', credentialResponse);
    // Here you can send the token to your backend for verification and user session management
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
    />
  );
};

export default GoogleLoginButton;
