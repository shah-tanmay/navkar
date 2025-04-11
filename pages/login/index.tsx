import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoaderWrapper } from "../../components/LoaderWrapper";
import { logoPath } from "../../constants";
import {
  BrandContainer,
  BrandText,
  ButtonContent,
  FooterLinks,
  GoogleButton,
  GoogleSVG,
  LoginCard,
  LoginContainer,
  LogoImage,
  Subtitle,
  Title,
} from "./styles";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const { error, redirect } = router.query;

  useEffect(() => {
    if (error) {
      console.error("Authentication error:", error);
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: typeof redirect === "string" ? redirect : "/",
      });
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoaderWrapper loading={isLoading}>
      <LoginContainer>
        <LoginCard>
          <BrandContainer>
            <BrandText>
              <LogoImage src={logoPath} alt="Navkar" />
            </BrandText>
          </BrandContainer>

          <Title>Premium Home Collections</Title>
          <Subtitle>
            Sign in with your Google account to access our exclusive collection
            of luxury curtains and bespoke home decor items
          </Subtitle>

          <GoogleButton
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            $loading={isLoading}
          >
            <ButtonContent $visible={!isLoading}>
              <GoogleSVG viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.545,6.476,2.545,12s4.476,10,10,10c5.523,0,10-4.476,10-10c0-0.685-0.057-1.369-0.163-2.041H12.545z"
                />
              </GoogleSVG>
              Continue with Google
            </ButtonContent>
          </GoogleButton>

          <FooterLinks>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
          </FooterLinks>
        </LoginCard>
      </LoginContainer>
    </LoaderWrapper>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
